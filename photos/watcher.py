import os
import threading
from time import sleep
from threading import Thread
from collections import defaultdict


class LocalWatcher:
    def __init__(self, folder_path, trigger):
        self.__FolderPath = folder_path
        self.__Trigger = trigger
        self.__Old = {}
        self.__Kill = False
        self.__Thread = None
        self.__PrevFiles = set()
        self.__CurrentFiles = set()

    def __get_last_modified_dict(self):
        for root, _, files in os.walk(self.__FolderPath):
            for file in files:
                file = os.path.join(root, file)
                self.__CurrentFiles.add(file)
                if self.__Old.get(file, 0) == 0:
                    try:
                        self.__Trigger("Create", file)
                        self.__Old[file] = os.stat(file).st_mtime
                    except Exception as e:
                        print(f"Trigger failed with {e}")
                if self.__Old.get(file, 0) != os.path.getmtime(file):
                    try:
                        self.__Trigger("Update", file)
                        self.__Old[file] = os.path.getmtime(file)
                    except Exception as e:
                        print(f"Trigger failed with {e}")
        for i in self.__PrevFiles.difference(self.__CurrentFiles):
            try:
                self.__Trigger("Delete", i)
            except Exception as e:
                print(f"Trigger failed with {e}")
        self.__PrevFiles = self.__CurrentFiles

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
        print(f"Start watcher {path}")
        Watcher = LocalWatcher(path, trigger)
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
        for key, value in self.__WatcherList:
            if value.is_alive():
                value.kill()
