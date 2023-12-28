import os
from time import sleep
from threading import Thread
import json

from config import CACHE_BASE_PATH


class LocalWatcher:
    def __init__(self, folder_path, trigger, global_watcher):
        self.__FolderPath = folder_path
        self.__Trigger = trigger
        self.__Old = {}
        self.__Kill = False
        self.__Thread = None
        self.__PrevFiles = None
        self.__CurrentFiles = set()
        self.__Global_Watcher = global_watcher
        self.CacheName = "watcher.json"
        if not os.path.exists(CACHE_BASE_PATH):
            os.makedirs(CACHE_BASE_PATH)
        self.__load_state()

    def __preserve_state(self):
        file = open(os.path.join(CACHE_BASE_PATH, self.CacheName), 'w')
        json.dump(self.__Old, file, indent=4)
        file.close()

    def __load_state(self):
        try:
            file = open(os.path.join(CACHE_BASE_PATH, self.CacheName), 'r')
            self.__Old = json.load(file)
            file.close()
        except FileNotFoundError:
            print("Unable to load the cache")

    def __get_last_modified_dict(self):
        for root, _, files in os.walk(self.__FolderPath):
            for file in files:
                if file.endswith('~'):
                    continue
                file = os.path.join(root, file)
                self.__CurrentFiles.add(file)
                if self.__Old.get(file, 0) == 0:
                    try:
                        self.__Trigger("Create", file)
                        try:
                            self.__Old[file] = os.path.getmtime(file)
                        except FileNotFoundError:
                            self.__Old.pop(file)
                    except Exception as e:
                        print(f"Trigger failed with {e}")
                if self.__Old.get(file, 0) != os.path.getmtime(file):
                    try:
                        self.__Trigger("Update", file)
                        try:
                            self.__Old[file] = os.path.getmtime(file)
                        except FileNotFoundError:
                            self.__Old.pop(file)
                    except Exception as e:
                        print(f"Trigger failed with {e}")
        if self.__PrevFiles is None:
            self.__PrevFiles = self.__CurrentFiles
        for i in self.__PrevFiles.difference(self.__CurrentFiles):
            try:
                self.__Trigger("Delete", i)
            except Exception as e:
                print(f"Trigger failed with {e}")
        self.__PrevFiles = self.__CurrentFiles
        self.__CurrentFiles = set()
        self.__preserve_state()
        sleep(1)

    def __run(self):
        while True:
            if self.__Kill:
                return
            self.__get_last_modified_dict()

    def start(self):
        self.__Thread = Thread(target=self.__run)
        self.__Thread.start()

    def kill(self):
        self.__Kill = True

    def is_alive(self):
        return self.__Thread.is_alive()


class GlobalWatcher:
    def __init__(self):
        self.__WatcherList = {}
        self.__ActiveWatchers = 0
        self.__Restart = False
        self.__Thread = None

    def start_watcher(self, path, trigger):
        print(f"Starting watcher for {path}")
        Watcher = LocalWatcher(path, trigger, self)
        Watcher.start()
        self.__WatcherList[path] = Watcher

    def __restart(self):
        while True:
            if not self.__Restart:
                return
            for key, value in self.__WatcherList:
                if not value.is_alive():
                    value.start()

    def kill_watcher(self, path):
        watcher = self.__WatcherList.get(path, None)
        if watcher is not None:
            self.__WatcherList.pop(path)
            watcher.kill()

    def enable_auto_restart(self):
        self.__Restart = True
        self.__Thread = Thread(target=self.__restart)
        self.__Thread.start()

    def disable_auto_restart(self):
        self.__Restart = False

    def __del__(self):
        for key, value in self.__WatcherList.items():
            if value.is_alive():
                value.kill()
