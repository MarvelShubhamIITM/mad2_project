export default{
    template:`
    <div>
    <label for="category">Select Category :</label>
    <select id="category" v-model="catval">
    <option value="all">All</option>
    <option value="servicerequest">Service Requests</option>
    <option value="professional">Professionals</option>
    </select>

    <span v-if="catval === 'servicerequest'">
        <label for="filter">Filter by:</label>
        <select id="filter" v-model="filterval">
        <option value="" >None</option>
        <option value="Accepted">Accepted</option>
        <option value="Requested">Requested</option>
        <option value="Rejected">Rejected</option>
        <option value="Closed">Closed</option>
        </select>
    </span>

    <span v-if="catval === 'professional'">
        <label for="filter">Sort by:</label>
        <select id="filter" v-model="filterval">
        <option value="" >None</option>
        <option value="rating">Rating</option>
        <option value="experience">Experience</option>
        <option value="price">Price</option>
        </select>
    </span>


    <span v-if="filterval === '' && catval === 'professional'">
        <label for="subfilter">Search by:</label>
        <select id="subfilter" v-model="subfilterval">
        <option value="" >None</option>
        <option value="name">Name</option>
        <option value="description">Service</option>
        </select>
    </span>



    <span v-if="catval==='professional' && filterval==='' && subfilterval">
    <label for="customer-search">Search:</label>
    <input type="text" id="customer-search" v-model="searchTerm" placeholder="Start typing..."/>
    </span>


    <div v-if="catval==='all' || catval==='professional'">
       <h4> Professionals :</h4>
        <p style="font-size:15px;font-weight: bold;">Index | ID | Name | Email ID | Service | Rating | Experience | Service description | Price</p>
       <div v-for="(prof,index) in filteredProfList">
            <p>{{index+1}}. {{prof.name}} {{prof.user}} {{prof.service}} {{prof.average_rating}} {{prof.experience}} {{prof.description}} {{prof.service_price}} </p>
       </div>
    </div>


    <div v-if="catval==='all' || catval==='servicerequest'">
       <h4> Service Requests:</h4>
       <p style="font-size:15px;font-weight: bold;">Index | Service Name | Professional Name | Request Date |   Status</p>
       <div v-for="(serv,index) in filteredServiceList">
            <p>{{index+1}}. {{serv.service}} {{serv.professional}} {{serv.request_date}} 
            <span v-if="serv.request_status==='Accepted'" style="color:lightgreen;font-size:15px;">  {{serv.request_status}}</span> 
            <span v-if="serv.request_status==='Closed'" style="color:Green;font-size:15px;"> {{serv.request_status}}</span> 
            <span v-if="serv.request_status==='Requested'" style="color:grey;font-size:15px;"> {{serv.request_status}}</span> 
            <span v-if="serv.request_status==='Rejected'" style="color:red;font-size:15px;"> {{serv.request_status}}</span> </p>

       </div>
    </div>
    </div>
    `,
    data(){
        return{
            proflist:[],
            servicelist:[],
            cust:null,
            catval:"all",
            filterval:null,
            subfilterval:'',
            searchTerm:"",

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
          filteredProfList() {
            let filteredList = [...this.proflist];
      
            if (this.filterval) {
                filteredList.sort((a, b) => {
                    if (this.filterval === "rating") {
                      return b.average_rating - a.average_rating; // Descending order of rating
                    } else if (this.filterval === "experience") {
                      return b.experience - a.experience; // Descending order of experience
                    } else if (this.filterval === "price") {
                      return b.service_price - a.service_price; // Descending order of price
                    }
                    return 0;
                  });
                }
            else{
                if (this.searchTerm===""){
                    return this.proflist;
                }
                const lowerSearchTerm = this.searchTerm.toLowerCase();
                return this.proflist.filter((cust) =>
                    String(cust[this.subfilterval]).toLowerCase().includes(lowerSearchTerm)
                );
            }
            return filteredList;
          },
          
    },
    watch: {
        catval(newValue, oldValue) {
          this.filterval = '';
        },
    },
    methods :{
        async fetchprofessionals(){
            const res = await fetch(location.origin + '/api/professional', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.proflist = await res.json();

        },
        async fetchservicerequests() {
            const res = await fetch(location.origin + '/api/servicerequest', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            const allservice = await res.json();
            this.servicelist = allservice.filter(req => req.customer_id === this.cust?.id);
        },
        async fetchcustomers(){
            const res = await fetch(location.origin + '/api/customer', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            const custlist = await res.json();
            this.cust = custlist.find((c) => c.user_id === this.$store.state.user_id);
        },
       
    },
    async mounted(){
        await this.fetchprofessionals();
        await this.fetchcustomers();
        await this.fetchservicerequests();
    }
}

