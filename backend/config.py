class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False



class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    DEBUG = True
    SECURITY_LOGIN_URL = '/login'
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "thisismysalt"
    SECRET_KEY = "honey"
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-token"

    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 5
    CACHE_REDIS_PORT = 6379



    WTF_CSRF_ENABLED = False