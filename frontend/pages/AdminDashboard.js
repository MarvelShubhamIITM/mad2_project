
export default {
    template: `
    <div>
    <h2>Welcome Admin</h2>
    <button @click="create_csv" style="background-color:lightblue">Export csv</button>
    <div>
       <h4> New Requests Professionals :</h4>
       <div v-for="(prof,index) in proflist">
            <p v-if="prof.status==='requested'">{{index+1}}. {{prof.name}} {{prof.user}} {{prof.service}} <button @click="viewdetails(prof)">View</button> | <button @click="approve(prof.user_id)">Approve</button> | <button  @click="opendialog(prof.user_id)">Reject</button></p>
       </div>
    </div>
    <div>
    <h4>Ongoing Requests :</h4>
    <p style="font-size:20px;font-weight: bold;">Index | Customer Name | Customer ID | Professional Name | Professional ID | Service | Date | Status </p>
    <div v-for="(req,index) in servicerequests" >
            <p>{{index+1}}. {{req.customer}} {{req.customer_id}} {{req.professional}} {{req.professional_id}} {{req.service}} {{req.request_date}} 
            <span v-if="req.request_status==='Requested'" style="color: grey; ">{{req.request_status}}</span> 
            <span v-if="req.request_status==='Accepted'" style="color: Green; ">{{req.request_status}}</span> 
            <span v-if="req.request_status==='Rejected'" style="color: red; ">{{req.request_status}}</span> 
            </p>
    </div>
    </div>
    <div>
    <h4>Closed Requests :</h4>
    <p style="font-size:20px;font-weight: bold;">Index | Customer Name | Customer ID | Professional Name | Professional ID | Service | Date | Rating | Remarks </p>
    <div v-for="(req,index) in servicerequestsclosed" >
            <p v-if="req.request_status==='Closed'">{{index+1}}. {{req.customer}} {{req.customer_id}} {{req.professional}} {{req.professional_id}} {{req.service}} {{req.completion_date}} {{req.rating}} {{req.remarks}}</p>
    </div>
    </div>
    <div v-if="dialog">
        <div>Remarks: <input placeholder="remarks" v-model="remark"/></div>
        <button @click="reject">Reject</button>
        <button @click="closedialog">Cancel</button>
    </div>
    <div v-if="showModal" style="border:2px solid black;width:300px">
          <button @click="closeModal">X</button>
          <h3>Professional Details</h3>
          <h5>Email Id : {{selectedProf?.user}}</h5>
          <div>Name : {{selectedProf?.name}} </div>
          <div>Phone : {{selectedProf?.phone}} </div>
          <div>Experience : {{selectedProf?.experience}} </div>
          <div>Rating : {{selectedProf?.average_rating}} </div>
          <div>Bank_acc : {{selectedProf?.bank_acc}} </div>
          <div>Adhaar_no : {{selectedProf?.adhaar_no}} </div>
          <div>Pincode : {{selectedProf?.pincode}} </div>
          <div>Service : {{selectedProf?.service}} </div>
          <div>Service Description : {{selectedProf?.description}}</div>
          <div>Service Price : {{selectedProf?.service_price}} </div>
      </div>
    </div>
    `,
    data(){
        return{
            proflist: [],
            showModal: false, 
            selectedProf: null,
            remark:null,
            dialog:false,
            rejprofid:null,
            servicerequests:[],
            servicerequestsclosed:[]
        }
    },
    methods:{
        async create_csv(){
            const res = await fetch(location.origin + '/create-csv')
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/get-csv/${task_id}`)
                if (res.ok){
                    console.log('data is ready')
                    window.open(`${location.origin}/get-csv/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)
            
        },
        async fetchprofessionals(){
            const res = await fetch(location.origin + '/api/professional', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.proflist = await res.json();

        },
        async approve(user_id){
            const response = await fetch(`${location.origin}/api/user/${user_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "status": "approved",
                }),
            });

            if (response.ok) {
                alert("User approved.")
                await this.fetchprofessionals();
            } else {
                console.error('Failed to apprpove user');
            }
        },
        async reject(){
                    await fetch(`${location.origin}/api/rejectprofessional/${this.rejprofid}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                    body: JSON.stringify({
                        "remark": this.remark,
                    }),
                });
               const response = await fetch(`${location.origin}/api/user/${this.rejprofid}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "status": "rejected",
                }),
            });

            if (response.ok) {
                alert("User Rejected.");
                this.closedialog();
                await this.fetchprofessionals();
            } else {
                console.error('Failed to reject user');
        }
        },
        viewdetails(prof) {
            this.selectedProf = prof; 
            this.showModal = true; 
          },
          closeModal() {
            this.showModal = false; 
            this.selectedProf = null; 
          },
          opendialog(user_id){
              this.dialog=true;
              this.rejprofid=user_id;
          },
          closedialog(){
            this.dialog=false;
            this.rejprofid=null;
        },
        async fetchservicerequests() {
            const res = await fetch(location.origin + '/api/servicerequest', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            const allRequests = await res.json();
            this.servicerequestsclosed = allRequests.filter(req => req.request_status === 'Closed');
            this.servicerequests = allRequests.filter(req => req.request_status !== 'Closed');
        },
    },
    async mounted(){
        this.fetchprofessionals();
        this.fetchservicerequests();
    }
}

