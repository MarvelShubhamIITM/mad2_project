export default{
    template:`
    <div>
    <div>
       <h4> Service Requests:</h4>
       <span>
        <label for="filter">Filter by:</label>
        <select id="filter" v-model="filterval">
        <option value="" >None</option>
        <option value="Accepted">Accepted</option>
        <option value="Requested">Requested</option>
        <option value="Rejected">Rejected</option>
        <option value="Closed">Closed</option>
        </select>
        </span>

       <p style="font-size:15px;font-weight: bold;">Index | Customer ID | Customer Name | Request Date |   Rating | Remarks(if any) | Status</p>
       <div v-for="(serv,index) in filteredServiceList">
            <p>{{index+1}}. {{serv.customer_id}} {{serv.customer}} {{serv.request_date}} {{serv.rating}} {{serv.remarks || "None"}}
            <span v-if="serv.request_status==='Accepted'" style="color:lightgreen;font-size:15px;">  {{serv.request_status}}</span> 
            <span v-if="serv.request_status==='Closed'" style="color:Green;font-size:15px;"> {{serv.request_status}}</span> 
            <span v-if="serv.request_status==='Requested'" style="color:grey;font-size:15px;"> {{serv.request_status}}</span> 
            <span v-if="serv.request_status==='Rejected'" style="color:red;font-size:15px;"> {{serv.request_status}}</span> </p>

       </div>
    </div>

    <div>
       <h4> Customers :</h4>
       <span>
        <label for="cfilter">Filter by:</label>
        <select id="cfilter" v-model="cfilterval">
        <option value="" >None</option>
        <option value="name">Name</option>
        <option value="id">ID</option>
        <option value="pincode">Pincode</option>
        </select>
        </span>

        <span v-if="cfilterval">
        <label for="customer-search">Search:</label>
        <input type="text" id="customer-search" v-model="searchTerm" placeholder="Start typing..."/>
        </span>

       <p style="font-size:15px;font-weight: bold;">Index | ID | Name | Email ID | Pincode | Address | Contact no.</p>
       <div v-for="(cust,index) in filteredCustList">
            <p>{{index+1}}. {{cust.id}} {{cust.name}} {{cust.user}} {{cust.pincode}} {{cust.address}} {{cust.phone}} </p>
       </div>
    </div>
    </div>
    `,
    data(){
        return{
            prof:null,
            servicelist:[],
            custlist:[],
            filterval:'',
            cfilterval:'',
            searchTerm:''

        }
    },
    computed :{
        filteredServiceList() {
            let filteredList = [...this.servicelist];
      
            if (this.filterval) {
              filteredList = filteredList.filter((service) =>
                service["request_status"] === this.filterval
              );
            }
            return filteredList;
          },
          filteredCustList() {
            let filteredList = [...this.custlist];
      
            if (this.cfilterval && this.searchTerm) {
                if (this.searchTerm===""){
                    return this.custlist;
                }
                const lowerSearchTerm = this.searchTerm.toLowerCase();
                return this.custlist.filter((cust) =>
                    String(cust[this.cfilterval]).toLowerCase().includes(lowerSearchTerm)
                );
            }
            return filteredList;
          },
    },
    methods:{
        async fetchservicerequests() {
            const res = await fetch(location.origin + '/api/servicerequest', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            const allservice = await res.json();
            this.servicelist = allservice.filter(req => req.professional_id === this.prof?.id);
              
        },
        async fetchprofessionals(){
            const res = await fetch(location.origin + '/api/professional', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            const proflist = await res.json();
            this.prof = proflist.find((c) => c.user_id === this.$store.state.user_id);
        },
        async fetchcustomers(){
            const res = await fetch(location.origin + '/api/customer', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.custlist = await res.json();
        },
    },
    async mounted(){
        await this.fetchprofessionals();
        await this.fetchservicerequests();
        await this.fetchcustomers();

    }
}

