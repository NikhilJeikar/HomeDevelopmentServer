import configparser

config = configparser.ConfigParser()
config.read('config.ini')

Elastic_Username = config['ELASTIC']['user']
Elastic_Password = config['ELASTIC']['password']

Sync_Path = config['SYNC']['base_path']

Security_Key = config['SECURITY']['secret']
Security_Algo = config['SECURITY']['algorithm']

FTP_BASE_PATH = "."
