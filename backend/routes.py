from flask import current_app as app, request, jsonify, render_template,send_file
from flask_security import auth_required, verify_password, hash_password
from backend.models import db,RejectProfessional
import json
from datetime import datetime
from backend.celery.tasks import add,create_csv
from celery.result import AsyncResult

datastore = app.security.datastore
cache=app.cache


@app.get("/")
def home():
    return render_template("index.html")

@app.get("/cache")
@cache.cached(timeout=5)
def cache():
    return {'time':str(datetime.now())}

@app.get("/celery")
def celery():
    task = add.delay(10,20)
    return {'task_id': task.id}


@app.get("/getcelerydata/<id>")
def getdata(id):
    result=AsyncResult(id)
    if result.ready():
        return {'result':result.result},200
    else:
        return {'message':'task not ready'},405


@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'task_id': task.id}

@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)

    if result.ready():
        return send_file(f'./backend/celery/user_downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready'}, 405
    


@app.get("/protected")
@auth_required("token")
def protected():
    return "<h1> Protected Page </h1>"



@app.route('/login', methods=["POST"])
def login():
    data=request.get_json()

    email=data.get("email")
    password=data.get("password")

    if not email or not password:
        return jsonify({"message" : "Invalid Inputs"}),404

    rejprof=RejectProfessional.query.filter_by(email=email).first()
    if rejprof:
        messagerjct="Your account is rejected by the admin. REASON : "+str(rejprof.remarks)+" Please create your account again with respective changes."
        return jsonify({"message":messagerjct}),404
    user=datastore.find_user(email=email)

    if not user:
        return jsonify({"message" : "Invalid email"}),404
    if user.active==False:
        return jsonify({"message":"user is currently inactive or blocked."}),404
    if user.roles[0].name=="service proffesional" and user.professional[0].status=="requested":
        return jsonify({"message":"Your account is under verification.You can login after approval by admin."}),404
    if verify_password(password, user.password):
        if user.roles[0].name=="service proffesional" and user.professional[0].status=="requested":
            return jsonify({"message":"Your account is under verification.You can login after approval by admin."}),404
        return jsonify({"token" : user.get_auth_token(),"role":user.roles[0].name,"id":user.id})
    return jsonify({"message" : "Wrong Password"}),404
    



@app.route('/register', methods=["POST"])
def register():
    data = request.get_json()  

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    if role=="Proffesional":
        role="service proffesional"
    elif role=="Customer":
        role="customer"


    if not email or not password or role not in ["admin","service proffesional","customer"]:
        return jsonify({"message" : "Invalid Inputs"}),404

    user=datastore.find_user(email=email)

    if user:
        return jsonify({"message" : "user already exists"}),404

    try:
        datastore.create_user(email=email,password=hash_password(password),roles=[role])
        db.session.commit()
        userreject=RejectProfessional.query.filter_by(email=email).first()
        if userreject:
            db.session.delete(userreject)
            db.session.commit()
        newuser=datastore.find_user(email=email)
        newuserid=newuser.id
        return jsonify({"message" : "new user created","user_id":newuserid}),200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating new user"}),404

