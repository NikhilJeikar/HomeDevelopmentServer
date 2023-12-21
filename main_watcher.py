from photos.handler import Trigger
from photos.watcher import GlobalWatcher
from config import FTP_BASE_PATH

Watcher = GlobalWatcher()
Watcher.start_watcher(FTP_BASE_PATH, Trigger)
