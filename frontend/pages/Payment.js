export default {
    template: `
        <div>
            <h1>Payment Page</h1>
            <p>Paying to : {{ servicerequest?.professional }}</p>
            <p>For Service : {{ servicerequest?.service }}</p>
            <div>
          <label>
            <input type="radio" v-model="rating" value=1 /> 1(Poor) 
          </label> 
          <label>
            <input type="radio" v-model="rating" value=2 /> 2 
          </label> 
          <label> 
            <input type="radio" v-model="rating" value=3 /> 3 
          </label> 
          <label>
            <input type="radio" v-model="rating" value=4 /> 4 
          </label>
          <label> 
            <input type="radio" v-model="rating" value=5 /> 5(Excellent)
          </label> 
        </div>
            <div>Remarks: <input v-model="remarks"/></div>
            <button @click="pay">Pay</button>
        </div>
    `,
    data() {
        return {
            reqId: null,
            servicerequest:null,
            rating:null,
            remarks:null,
        };
    },
    methods :{
        async pay(){
            const res=await fetch(`${location.origin}/api/servicerequest`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "id" : this.reqId,
                    "status": "Closed",
                    "rating":this.rating,
                    "remarks":this.remarks,
                }),
            });
            if(res.ok){
                alert("Payment Successful.");
                this.$router.push('/customerdashboard');
                
            }
            else{
                console.log(res)
                alert("Payment Failed.");
            }
        },
        async fetchservicerequests() {
            const res = await fetch(location.origin + '/api/servicerequest', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            const allRequests = await res.json();
            this.servicerequest = allRequests.find(req => String(req.id) === String(this.reqId));

        },
    },
    mounted() {
        this.reqId = this.$route.params.req_id;
        this.fetchservicerequests();
    },
};
