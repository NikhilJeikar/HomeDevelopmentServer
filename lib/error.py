class Severity:
    MESSAGE = 0
    ERROR = 1
    FAILURE = 2
    WARNING = 3


class Error:
    def __init__(self):
        self.Name = None
        self.Severity = None
        self.Message = None
