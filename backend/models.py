from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property


db=SQLAlchemy()



class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)
    # flask-security specific
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)
    active = db.Column(db.Boolean, default = True)
    roles = db.Relationship('Role', backref = 'holders', secondary='user_roles')



class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable  = False)
    description = db.Column(db.String, nullable = False)



class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))




class Professional(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name=db.Column(db.String,nullable=False)
    phone=db.Column(db.Integer,nullable=False)
    description=db.Column(db.String,nullable=False)
    experience=db.Column(db.Integer)
    bank_acc=db.Column(db.Integer)
    adhaar_no=db.Column(db.Integer)
    pincode=db.Column(db.Integer)
    pfp=db.Column(db.String)
    docs=db.Column(db.String)
    user_id=db.Column(db.Integer,db.ForeignKey("user.id"),nullable=False)
    user = db.relationship('User', backref='professional')
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    service = db.relationship('Service', backref=db.backref('professionals', lazy=True))
    service_price=db.Column(db.Integer)
    status=db.Column(db.String,default = "requested")
    @hybrid_property
    def average_rating(self):
        ratings = [req.rating for req in self.profreq if req.rating is not None]
        if ratings:
            return sum(ratings) / len(ratings)
        return 0  



class Customer(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name=db.Column(db.String,nullable=False)
    address=db.Column(db.String,nullable=False)
    pincode=db.Column(db.Integer)
    phone=db.Column(db.Integer,nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey("user.id"),nullable=False)
    user = db.relationship('User', backref='customer')
    status=db.Column(db.String,default = "active")
    




class Service(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name=db.Column(db.String,nullable=False)
    price=db.Column(db.Integer,nullable=False)
    time=db.Column(db.String)
    description=db.Column(db.Integer,nullable=False)
    



class ServiceRequest(db.Model):
    __tablename__="service_request"
    id = db.Column(db.Integer, primary_key = True)
    service_id=db.Column(db.Integer,db.ForeignKey("service.id"),nullable=False)
    service = db.relationship('Service', backref='servreq')
    customer_id=db.Column(db.Integer,db.ForeignKey("customer.id"),nullable=False)
    customer = db.relationship('Customer', backref='custreq')
    professional_id=db.Column(db.Integer,db.ForeignKey("professional.id"),nullable=False)
    professional = db.relationship('Professional', backref='profreq')
    request_date=db.Column(db.DateTime,default=datetime.utcnow)
    completion_date=db.Column(db.DateTime,nullable=True)
    request_status=db.Column(db.String)
    rating=db.Column(db.Integer,nullable=True)
    remarks=db.Column(db.String,nullable=True)



class RejectProfessional(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, nullable = False)
    remarks=db.Column(db.String)
