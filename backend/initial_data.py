from flask import current_app as app
from backend.models import db,Professional,Customer,Service,User
from flask_security import SQLAlchemyUserDatastore, hash_password



with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name="admin" , description="superuser/administrator of the app")
    userdatastore.find_or_create_role(name="service proffesional" , description="one who provides services for home")
    userdatastore.find_or_create_role(name="customer" , description="normal user of app who demands services")


    if (not userdatastore.find_user(email="admin@gmail.com")):
        userdatastore.create_user(email="admin@gmail.com",password=hash_password("pass123"),roles=["admin"])
        serv=Service(name="Service1",price=1000,time="2hrs",description="description")
        db.session.add(serv)
        serv2=Service(name="Service2",price=2000,time="2hrs",description="description")
        db.session.add(serv2)
        serv3=Service(name="Service3",price=3000,time="3hrs",description="description")
        db.session.add(serv3)
        serv4=Service(name="Service4",price=4000,time="4hrs",description="description")
        db.session.add(serv4)
        serv5=Service(name="Service5",price=5000,time="2.5hrs",description="description")
        db.session.add(serv5)
    if (not userdatastore.find_user(email="proff1@gmail.com")):
        userdatastore.create_user(email="proff1@gmail.com",password=hash_password("pass123"),roles=["service proffesional"])
        db.session.commit()
        u=User.query.filter_by(email="proff1@gmail.com").first()
        prof=Professional(name="Professional1",phone=1234567890,service_id=1,description="description",experience=2,bank_acc=123456789012,adhaar_no=1234567890123456,pincode=246701,user_id=u.id,service_price=1200)
        db.session.add(prof)
    if (not userdatastore.find_user(email="proff2@gmail.com")):
        userdatastore.create_user(email="proff2@gmail.com",password=hash_password("pass123"),roles=["service proffesional"])
        db.session.commit()
        u=User.query.filter_by(email="proff2@gmail.com").first()
        prof2=Professional(name="Professional2",phone=1234567890,service_id=2,description="description",experience=2,bank_acc=123456789012,adhaar_no=1234567890123456,pincode=246701,user_id=u.id,service_price=2500)
        db.session.add(prof2)
    if (not userdatastore.find_user(email="proff3@gmail.com")):
        userdatastore.create_user(email="proff3@gmail.com",password=hash_password("pass123"),roles=["service proffesional"])
        db.session.commit()
        u=User.query.filter_by(email="proff3@gmail.com").first()
        prof3=Professional(name="Professional3",phone=1234567890,service_id=1,description="description",experience=2,bank_acc=123456789012,adhaar_no=1234567890123456,pincode=246701,user_id=u.id,service_price=1000)
        db.session.add(prof3)
    if (not userdatastore.find_user(email="proff4@gmail.com")):
        userdatastore.create_user(email="proff4@gmail.com",password=hash_password("pass123"),roles=["service proffesional"])
        db.session.commit()
        u=User.query.filter_by(email="proff4@gmail.com").first()
        prof4=Professional(name="Professional4",phone=1234567890,service_id=4,description="description",experience=2,bank_acc=123456789012,adhaar_no=1234567890123456,pincode=246701,user_id=u.id,service_price=4000)
        db.session.add(prof4)
    if (not userdatastore.find_user(email="proff5@gmail.com")):
        userdatastore.create_user(email="proff5@gmail.com",password=hash_password("pass123"),roles=["service proffesional"])
        db.session.commit()
        u=User.query.filter_by(email="proff5@gmail.com").first()
        prof5=Professional(name="Professional5",phone=1234567890,service_id=4,description="description",experience=3,bank_acc=123456789012,adhaar_no=12345678923456,pincode=246701,user_id=u.id,service_price=4500)
        db.session.add(prof5)
    if (not userdatastore.find_user(email="proff6@gmail.com")):
        userdatastore.create_user(email="proff6@gmail.com",password=hash_password("pass123"),roles=["service proffesional"])
        db.session.commit()
        u=User.query.filter_by(email="proff6@gmail.com").first()
        prof6=Professional(name="Professional6",phone=1234567890,service_id=4,description="description",experience=4,bank_acc=12456789012,adhaar_no=12347890123456,pincode=246701,user_id=u.id,service_price=4300)
        db.session.add(prof6)
    if (not userdatastore.find_user(email="cust1@gmail.com")):
        userdatastore.create_user(email="cust1@gmail.com",password=hash_password("pass123"),roles=["customer"])
        db.session.commit()
        u=User.query.filter_by(email="cust1@gmail.com").first()
        cust=Customer(name="Customer1",address="address",pincode=143256,phone=126783825,user_id=u.id)
        db.session.add(cust)
    if (not userdatastore.find_user(email="cust2@gmail.com")):
        userdatastore.create_user(email="cust2@gmail.com",password=hash_password("pass123"),roles=["customer"])
        db.session.commit()
        u=User.query.filter_by(email="cust2@gmail.com").first()
        cust2=Customer(name="Customer2",address="address",pincode=143256,phone=126783825,user_id=u.id)
        db.session.add(cust2)


    db.session.commit()
