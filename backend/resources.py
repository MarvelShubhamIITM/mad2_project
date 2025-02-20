from flask import jsonify,request,make_response,current_app as app
from flask_restful import Api,Resource,fields,marshal_with
from flask_security import auth_required,current_user
from backend.models import db,Customer,Professional,User,Role,Service,ServiceRequest,RejectProfessional
import json
import os
from datetime import datetime


cache=app.cache

api=Api(prefix="/api")


service_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'price' : fields.Integer,
    'time' : fields.String,
    'description': fields.String,
}

customer_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'address' : fields.String,
    'pincode' : fields.Integer,
    'phone': fields.Integer,
    'user': fields.String(attribute=lambda p: p.user.email if p.user else None),
    'user_id':fields.Integer,
    'status':fields.String
}


professional_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'phone': fields.Integer,
    'description': fields.String,
    'experience': fields.Integer,
    'average_rating': fields.Integer,
    'bank_acc': fields.Integer,
    'adhaar_no': fields.Integer,    'pincode': fields.Integer,
    'pfp': fields.String,
    'docs': fields.String,
    'user_id': fields.Integer,
    'user': fields.String(attribute=lambda p: p.user.email if p.user else None),
    'service_id': fields.Integer,
    'service': fields.String(attribute=lambda s: s.service.name if s.user else None),
    'service_price':fields.Integer,
    'status' : fields.String,
}

servicereq_fields={
    'id': fields.Integer,
    'service_id': fields.Integer,
    'service': fields.String(attribute=lambda p: p.service.name if p.service else None),
    'customer_id': fields.Integer,
    'customer': fields.String(attribute=lambda p: p.customer.name if p.customer else None),
    'professional_id': fields.Integer,
    'professional': fields.String(attribute=lambda p: p.professional.name if p.professional else None),
    'request_date': fields.DateTime,
    'completion_date': fields.DateTime,
    'request_status': fields.String,
    'rating': fields.Integer,
    'remarks': fields.String,
}



class UserApi(Resource):


    def get(self,user_id):
        user = User.query.get(int(user_id))
        if (user.roles[0]=="service proffesional"):
            data={'id':user.id,'email':user.email,'pid':user.professional[0].id,'name':user.professional[0].name,'phone': user.professional[0].phone,'description':user.professional[0].description ,'experience':user.professional[0].experience,'average_rating':user.professional[0].average_rating,'bank_acc':user.professional[0].bank_acc,'adhaar_no':user.professional[0].adhaar_no,'pincode':user.professional[0].pincode,'pfp':user.professional[0].pfp,'docs':user.professional[0].docs,'service':user.professional[0].service.name,'service_price':user.professional[0].service_price}
        if (user.roles[0]=="customer"):
            data={'id':user.customer[0].id,'email':user.email,'name':user.customer[0].name,'phone': user.customer[0].phone,'pincode':user.customer[0].pincode,'address':user.customer[0].address,}
        return jsonify(data)



    def post(self,user_id):
        metadata_json = request.form.get('metadata')
        if metadata_json:
            metadata = json.loads(metadata_json)
        else:
            return jsonify({"error": "Metadata is missing"}), 400

        role = metadata.get('role')
        phone = metadata.get('phone')
        name = metadata.get('name')
        pincode = metadata.get('pincode')
        description = metadata.get('description')
        service = metadata.get('service')
        address = metadata.get('address')
        experience = metadata.get('experience')
        bank_acc = metadata.get('bank_acc')
        adhaar_no = metadata.get('adhaar_no')
        service_price=metadata.get('service_price')
        if role=="Proffesional":
            pfp_file = request.files.get('pfp')
            docs_file = request.files.get('docs')  

            if pfp_file:
                pfp_file.save(os.path.join("frontend/profimgdocs/images/",str(user_id)))
                pfplink="frontend/profimgdocs/images/"+str(user_id)
            else:
                pfplink="NoImage"
            if docs_file:
                docs_file.save(os.path.join("frontend/profimgdocs/docs/",str(user_id)))
                docslink="frontend/profimgdocs/docs/"+str(user_id)
            else:
                docslink="NoDocs"
        try:
            if role=="Proffesional":
                proff=Professional(name=name,phone=phone,service_id=int(service),description=description,experience=experience,bank_acc=bank_acc,adhaar_no=adhaar_no,pincode=pincode,user_id=int(user_id),pfp=pfplink,docs=docslink,service_price=service_price)
                db.session.add(proff)
                db.session.commit()
                return make_response(jsonify({"message":"user created"}),200)
            elif role=="Customer":
                cust=Customer(name=name,address=address,pincode=pincode,phone=phone,user_id=int(user_id))
                db.session.add(cust)
                db.session.commit()
                return make_response(jsonify({"message":"user created"}),200)
            else:
                return jsonify({"message":"invalid role"}),404
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500



    @auth_required('token')
    def put(self,user_id):
        user = User.query.get(int(user_id))
        data = request.get_json()
        if (user.roles[0]=="service proffesional"):
            professional=Professional.query.filter_by(user_id=user_id).first()
            name = data.get('name')
            if name:
                professional.name = name

            phone = data.get('phone')
            if phone:
                professional.phone = phone

            description = data.get('description')
            if description:
                professional.description = description

            experience = data.get('experience')
            if experience:
                professional.experience = experience

            bank_acc = data.get('bank_acc')
            if bank_acc:
                professional.bank_acc = bank_acc

            adhaar_no = data.get('adhaar_no')
            if adhaar_no:
                professional.adhaar_no = adhaar_no

            pincode = data.get('pincode')
            if pincode:
                professional.pincode = pincode

            service_id = data.get('service')
            if service_id:
                professional.service_id = service_id

            service_price = data.get('service_price')
            if service_price:
                professional.service_price = service_price

            status = data.get('status')
            if status:
                professional.status = status


        if (user.roles[0]=="customer"):
            customer=Customer.query.filter_by(user_id=user_id).first()
            name = data.get('name')
            if name:
                customer.name = name

            phone = data.get('phone')
            if phone:
                customer.phone = phone
            pincode = data.get('pincode')
            if pincode:
                customer.pincode = pincode
            address = data.get('address')
            if address:
                customer.address = address
            status = data.get('status')
            if status:
                customer.status = status


        try:
            db.session.commit()
            return make_response(jsonify({"message": "Profile updated successfully"}), 200)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": f"An error occurred: {str(e)}"}), 500)

    @auth_required('token')
    def delete(self,user_id):
        user = User.query.get(int(user_id))
        professional=Professional.query.filter_by(user_id=user_id).first()
        try:
            db.session.delete(professional)
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({"message": "Profile deleted successfully"}), 200)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": f"An error occurred: {str(e)}"}), 500)






class ServiceApi(Resource):
    
    @marshal_with(service_fields)
    @cache.cached()
    def get(self):
        service=Service.query.all()
        return service


    @auth_required('token')
    def post(self):
        name = request.form.get('name')
        price = request.form.get('price')
        time = request.form.get('time')
        description = request.form.get('description')
        service=Service(name=name,price=price,time=time,description=description)
        try:
            db.session.add(service)
            db.session.commit()
            return make_response(jsonify({"message":"success"}),200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message":"failed"}),404)



    @auth_required('token')
    def put(self):
        name = request.form.get('name')
        price = request.form.get('price')
        time = request.form.get('time')
        description = request.form.get('description')
        sid=request.form.get('sid')
        sid=int(sid)
        service=Service.query.get(sid)
        service.name=name
        service.price=price
        service.time=time
        service.description=description

        try:
            db.session.commit()
            return make_response(jsonify({"message":"success"}),200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message":"failed"}),404)




    @auth_required('token')
    def delete(self):
        data=request.get_json()
        sid=data.get("sid")
        service=Service.query.get(sid)
        try:
            db.session.delete(service)
            db.session.commit()
            return make_response(jsonify({"message":"success"}),200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message":"failed"}),404)


class ProfessionalApi(Resource):

    @auth_required('token')
    @cache.cached()
    @marshal_with(professional_fields)
    def get(self):
        proflist=Professional.query.all()
        return proflist


class CustomerApi(Resource):

    @auth_required('token')
    @cache.cached()
    @marshal_with(customer_fields)
    def get(self):
        custlist=Customer.query.all()
        return custlist



class ServiceRequestApi(Resource):

    @auth_required('token')
    def post(self):
        data = request.get_json()
        customer=data.get('customer')
        professional=data.get('professional')
        service=data.get('service')
        newreq=ServiceRequest(service_id=int(service),customer_id=int(customer),professional_id=int(professional),request_status="Requested")
        try:
            db.session.add(newreq)
            db.session.commit()
            return make_response(jsonify({"message":"success"}),200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message":"failed"}),404)



    @auth_required('token')
    @marshal_with(servicereq_fields)
    def get(self):
        Services=ServiceRequest.query.all()
        return Services


    @auth_required('token')
    def put(self):
        data = request.get_json()
        req_id=int(data.get('id'))
        status=data.get('status')
        req=ServiceRequest.query.get(req_id)
        if status=="Closed":
            req.completion_date=datetime.utcnow()
            req.rating=int(data.get('rating'))
            req.remarks=data.get('remarks')
        req.request_status=status
        try:
            db.session.commit()
            return make_response(jsonify({"message":"success"}),200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message":"failed"}),404)




    @auth_required('token')
    def delete(self):
        data = request.get_json()
        req_id=int(data.get('id'))
        req=ServiceRequest.query.get(req_id)
        try:
            db.session.delete(req)
            db.session.commit()
            return make_response(jsonify({"message":"success"}),200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message":"failed"}),404)



    
class RejectProfessionalApi(Resource):

    @cache.cached()
    def get(self,emailid):
        prof=RejectProfessional.query.filter_by(email=emailid).first()
        return prof  


    @auth_required('token')
    def post(self,emailid):
        user_id=emailid
        data=request.get_json()
        user=User.query.get(int(user_id))
        rjctreq=RejectProfessional(email=user.email,remarks=data.get('remark'))
        db.session.add(rjctreq)
        db.session.commit()
        return make_response(jsonify({"message":"success"}),200)
        


class SummaryAdmin(Resource):
    def get(self):
        professionals=Professional.query.count()
        customers=Customer.query.count()
        service=Service.query.count()

        closedservicerequest = ServiceRequest.query.filter(ServiceRequest.request_status == "Closed").count()
        acceptedservicerequest = ServiceRequest.query.filter(ServiceRequest.request_status == "Accepted").count()
        rejectedservicerequest = ServiceRequest.query.filter(ServiceRequest.request_status == "Rejected").count()
        requestedservicerequest = ServiceRequest.query.filter(ServiceRequest.request_status == "Requested").count()

        return jsonify({
            'professionals': professionals,
            'customers': customers,
            'services': service,
            'closed_service_requests': closedservicerequest,
            'accepted_service_requests': acceptedservicerequest,
            'rejected_service_requests': rejectedservicerequest,
            'requested_service_requests': requestedservicerequest
        })





api.add_resource(UserApi,'/user/<user_id>')
api.add_resource(ServiceApi,'/service')
api.add_resource(ProfessionalApi,'/professional')
api.add_resource(CustomerApi,'/customer')
api.add_resource(ServiceRequestApi,'/servicerequest')
api.add_resource(SummaryAdmin,'/adminsummary')

api.add_resource(RejectProfessionalApi,'/rejectprofessional/<emailid>')




