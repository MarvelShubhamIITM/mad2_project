export default {
    template: `
    <div>
    <div v-if="show==='showdashboard'">
    <h1>Welcome {{cust?.name}}</h1>
    <div @click="goprofile" style="color:Blue;font-size: 18px;font-weight: bold;" onmouseover="this.style.textDecoration='underline';this.style.cursor='pointer'" 
    onmouseout="this.style.textDecoration='none';this.style.cursor='default'">Manage Profile</div>
    <div>
    <h4>Looking for a service?? Find here...</h4>
    <p>S.no.   Service   Description   Price(starting from)
    <div v-for="(service,index) in services" >
            <p>{{index+1}}. <span @click="changeshow(service.id)" onmouseover="this.style.textDecoration='underline';this.style.cursor='pointer';;this.style.color='blue'" onmouseout="this.style.textDecoration='none';this.style.cursor='default';this.style.color='black'">{{service.name}}</span> {{service.description}} {{service.price}}</p>
    </div>
    </div>
    <div>
    <h4>Current Bookings:</h4>
    <div v-for="(req,index) in servicerequests" >
            <p v-if="req.customer_id===cust.id && req.request_status!=='Completed'">{{index+1}}. {{req.professional}} {{req.service}} {{req.request_status}} <button @click="viewfromhistory(req)">View</button></p>
    </div>
    </div>
    </div>
    <div  v-if="show==='showservice'">
    <button @click="changeshowback">Back</button>
    <div v-for="(prof,index) in professionals" >
            <p v-if="prof.service_id===targetservice && prof.status==='approved'">{{prof.name}} {{prof.description}} {{prof.service_price}} <button @click="viewdetail(prof)">View Details</button></p>
    </div>
    </div>
    <div v-if="show==='showdetail'">
        <button @click="viewdetailback">Go Back</button>
    <h3>Email Id : {{targetprof?.user}}</h3>
    <div>Name : {{targetprof?.name}} </div>
    <div>Phone : {{targetprof?.phone}} </div>
    <div>Experience : {{targetprof?.experience}} </div>
    <div>Rating : {{targetprof?.average_rating}} </div>
    <div>Pincode : {{targetprof?.pincode}} </div>
    <div>Service : {{targetprof?.service}} </div>
    <div>Service Description : {{targetprof?.description}}</div>
    <div>Service Price : {{targetprof?.service_price}} </div>
    <div v-for="req in servicerequests">
    <div v-if="req.customer_id===cust.id && req.professional_id===targetprof.id">
    <span v-if="req.request_status==='Requested'">{{req.request_status}} on {{req.request_date}}  <button @click="cancelbooking(req.id)">Cancel Request</button></span>
    <span v-if="req.request_status==='Accepted'">{{req.request_status}} <button @click="redirectToPayment(req.id)">Close Request</button></span>
    <span v-if="req.request_status==='Rejected'">{{req.request_status}} (You can cancel it and make a new request.)  <button @click="cancelbooking(req.id)">Cancel Request</button></span></div>
    </div>
    <button v-if="!servicerequests.some(req => req.customer_id === cust.id && req.professional_id === targetprof.id)" @click="booknow">BOOK NOW</button>
    </div>
    </div>
    `,
    data() {
        return {
            cust: null,
            services: [],
            professionals: [],
            show: "showdashboard",
            targetservice: null,
            targetprof: null,
            servicerequests: [],
            previousShow: null,
        }
    },
    methods: {
        async fetchcustomer() {
            const res = await fetch(`${location.origin}/api/user/${this.$store.state.user_id}`, { method: "GET" });
            this.cust = await res.json();
        },
        async fetchservice() {
            const res = await fetch(location.origin + '/api/service', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.services = await res.json();
        },
        async fetchprofessionals() {
            const res = await fetch(location.origin + '/api/professional', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.professionals = await res.json();
        },
        async fetchservicerequests() {
            const res = await fetch(location.origin + '/api/servicerequest', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            const allRequests = await res.json();
            this.servicerequests = allRequests.filter(req => req.request_status !== 'Closed');
        },
        goprofile() {
            this.$router.push('/customerprofile');

        },
        changeshow(service_id) {
            this.show = "showservice";
            this.targetservice = service_id;
        },
        changeshowback() {
            this.show = "showdashboard";
            this.targetservice = null;
        },
        viewdetail(prof) {
            this.show = "showdetail";
            this.previousShow = "showservice";
            this.targetprof = prof;
        },
        viewdetailback() {
            this.show = "showservice";
            this.show = this.previousShow;
            this.targetprof = null;
        },
        async booknow() {
            const res = await fetch(`${location.origin}/api/servicerequest`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "customer": this.cust.id,
                    "professional": this.targetprof.id,
                    "service": this.targetservice
                }),
            });
            if (res.ok) {
                alert("Request Sent.");
                await this.fetchservicerequests();
            }
            else {
                alert("Failed to book.");
            }
        },
        viewfromhistory(req) {
            const prof = this.professionals.find(p => p.id === req.professional_id);
            this.targetprof = prof;
            this.previousShow = "showdashboard";
            this.show = "showdetail";
        },
        async cancelbooking(req_id) {
            const conf = confirm("Are u sure to cancel this booking.");
            if (conf) {
                try {
                    await fetch(location.origin + '/api/servicerequest', { method: "DELETE", headers: { 'content-type': 'application/json', 'Authentication-Token': this.$store.state.auth_token }, body: JSON.stringify({ 'id': req_id }) });
                    alert("Booking Cancelled.");
                    await this.fetchservicerequests();
                } catch (error) {
                    alert("Failed to cancel booking.");
                }
            }
            else {
                return;
            }
        },
        redirectToPayment(reqId) {
            this.$router.push({ path: `/payment/${reqId}` });
        },
    },
    mounted() {
        this.fetchcustomer();
        this.fetchservice();
        this.fetchprofessionals();
        this.fetchservicerequests();
    }
}