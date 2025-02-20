from celery import shared_task
from backend.models import ServiceRequest
import flask_excel
from backend.celery.mail_service import send_email


@shared_task(ignore_results=False)
def add(x,y):
    return x+y


@shared_task(bind=True,ignore_results=False)
def create_csv(self):
    resource=ServiceRequest.query.all()
 
    task_id=self.request.id
    filename= f'request_data_{task_id}.csv'
    column_names=[column.name for column in ServiceRequest.__table__.columns ]
    csv_out=flask_excel.make_response_from_query_sets(resource,column_names=column_names,file_type='csv')

    with open(f'./backend/celery/user_downloads/{filename}','wb') as file:
        file.write(csv_out.data)

    return filename


