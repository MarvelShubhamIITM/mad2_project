export default {
    template: `
    <div>
    <div v-if="show==='showdashboard'">
    <h3>Welcome {{prof?.name}}</h3>
    <div>
    <h4>New Requests:</h4>
    <p style="font-size:15px;font-weight: bold;">Index |Customer Name | Request Date</p>
    <div v-for="(req,index) in servicerequests" >
            <p v-if="req.professional_id===prof?.pid && req.request_status==='Requested'">{{index+1}}. {{req.customer}} {{req.request_date}} <button @click="fetchCustomerDetails(req)" style="background-color: SkyBlue; color: black;">Open</button></p>
    </div>
    </div>
    <div>
    <h4>Closed Requests:</h4>
    <p style="font-size:15px;font-weight: bold;">Index | Customer Name | Request Date | Completion Date | Rating | Remarks(if any)</p>

    <div v-for="(req,index) in servicerequests" >
            <p v-if="req.professional_id===prof?.pid && req.request_status==='Closed'">{{index+1}}. {{req.customer}} {{req.request_date}} {{req.completion_date}} {{req.rating}} {{req.remarks}}</p>
    </div>
    </div>
    </div>
    <div v-if="show==='showcustomer' && customerDetails">
    <button @click="back"  style="background-color: black; color: white;">Back</button>
    <div>Request Details :</div>
    <div>Name : {{customerDetails.name}}</div>
    <div>Address : {{customerDetails.address}}</div>
    <div>Pincode : {{customerDetails.pincode}}</div>
    <div>Contact no. : {{customerDetails.phone}}</div>
    <div v-if="status==='Requested'">
    <button  @click="acceptreq" style="background-color: green; color: white;">Accept</button>
    <button  @click="rejectreq" style="background-color: red; color: white;">Reject</button>
    </div>
    <div v-if="status==='Accepted'" style="color:green;font-size: 20px;font-weight: bold;">
    Accepted
    </div>
    <div v-if="status==='Rejected'" style="color:red;font-size: 20px;font-weight: bold;">
    Rejected
    </div>
    </div>
    </div>
    `,
    data() {
        return {
            prof: null,
            servicerequests: [],
            allCustomers: [],
            customerDetails: null,
            show:"showdashboard",
            selectedreq:null,
            status:null
        }
    },
    methods: {
        async fetchprofessional() {
            const res = await fetch(`${location.origin}/api/user/${this.$store.state.user_id}`, { method: "GET" });
            this.prof = await res.json();
        },
        async fetchservicerequests() {
            const res = await fetch(location.origin + '/api/servicerequest', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.servicerequests = await res.json();
        },
        async fetchAllCustomers() {
            try {
                const res = await fetch(location.origin + "/api/customer", {
                    method: "GET",
                    headers: { "Authentication-Token": this.$store.state.auth_token },
                });
                this.allCustomers = await res.json();
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },
        fetchCustomerDetails(req) {
            const customerId=req.customer_id;
            this.show="showcustomer";
            this.selectedreq=req.id;
            const customer = this.allCustomers.find((cust) => cust.id === customerId);
            if (customer) {
                this.customerDetails = customer;
                this.status=req.request_status || "Requested";
            } else {
                alert("Customer not found");
            }
        },
        back(){
            this.show="showdashboard";
            this.selectedreq=null;
            this.status=null;
        },
        async acceptreq(){
            const res=await fetch(`${location.origin}/api/servicerequest`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "id" : this.selectedreq,
                    "status": "Accepted",
                }),
            });
            if(res.ok){
                alert("Request Accepted.");
                this.status = "Accepted";
                this.fetchservicerequests();
            }
            else{
                alert("Failed to accept request.");
            }
        },
        async rejectreq(){
            const res=await fetch(`${location.origin}/api/servicerequest`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "id" : this.selectedreq,
                    "status": "Rejected",
                }),
            });
            if(res.ok){
                alert("Request Rejected.");
                this.status = "Rejected";
                this.fetchservicerequests();

            }
            else{
                alert("Failed to reject request.");
            }
        }
    },
    mounted() {
        this.fetchprofessional();
        this.fetchservicerequests();
        this.fetchAllCustomers();
    }
}