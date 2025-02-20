export default{
    template :`
    <div>
    <label for="category">Select Category :</label>
    <select id="category" v-model="catval">
    <option value="all">All</option>
    <option value="servicerequest">Service Requests</option>
    <option value="professional">Professionals</option>
    <option value="customer">Customers</option>
    </select>


    <span v-if="catval !== 'all'">
        <label for="filter">Filter by:</label>
        <select id="filter" v-model="filterval">
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
    </span>


    <span v-if="catval==='servicerequest'">
        <label for="subfilter">Sub Filter by:</label>
        <select id="subfilter" v-model="subfilterval">
          <option v-for="option in subfilterOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
    </span>

    <span v-if="catval==='customer' && filterval">
    <label for="customer-search">Search Customer:</label>
    <input type="text" id="customer-search" v-model="searchTerm" placeholder="Start typing..."/>
    </span>

    <span v-if="catval==='professional' && filterval">
    <label for="prof-search">Search Professional:</label>
    <input type="text" id="prof-search" v-model="searchTerm" placeholder="Start typing..."/>
    </span>


    <div v-if="catval==='all' || catval==='professional'">
       <h4> Professionals :</h4>
        <p style="font-size:15px;font-weight: bold;">Index | ID | Name | Email ID | Service | Rating | Experience | Service description | Price</p>
       <div v-for="(prof,index) in filteredProfessionals">
            <p>{{index+1}}. {{prof.id}} {{prof.name}} {{prof.user}} {{prof.service}} {{prof.average_rating}} {{prof.experience}} {{prof.description}} {{prof.service_price}}
            <button style="background-color: orangered;" v-if="prof.status==='approved'" @click="flag(prof.user_id)">Flag</button> 
            <button style="background-color: lightgreen;" v-if="prof.status==='flagged'" @click="unflag(prof.user_id,'prof')">Unflag</button></p>
       </div>
    </div>
    <div v-if="catval==='all' || catval==='customer'">
       <h4> Customers :</h4>
       <p style="font-size:15px;font-weight: bold;">Index | ID | Name | Email ID | Pincode | Address | Contact no.</p>
       <div v-for="(cust,index) in filteredCustomers">
            <p>{{index+1}}. {{cust.id}} {{cust.name}} {{cust.user}} {{cust.pincode}} {{cust.address}} {{cust.phone}} 
            <button style="background-color: orangered;" v-if="cust.status==='active'" @click="flag(cust.user_id)">Flag</button> 
            <button style="background-color: lightgreen;" v-if="cust.status==='flagged'" @click="unflag(cust.user_id,'customer')">Unflag</button></p>
       </div>
    </div>
    <div v-if="catval==='all' || catval==='servicerequest'">
       <h4> Service Requests:</h4>
       <p style="font-size:15px;font-weight: bold;">Index | Service Name | Professional Name | Customer Name | Status | Rating | Remarks(if any)</p>
       <div v-for="(serv,index) in filteredServiceList">
            <p>{{index+1}}. {{serv.service}} {{serv.professional}} {{serv.customer}} {{serv.request_status}} {{serv.rating}} {{serv.remarks}}</p>
       </div>
    </div>
    </div>
    `,
    data(){
        return{
            proflist: [],
            custlist:[],
            servicelist:[],
            catval:"all",
            filterval:null,
            subfilterval:null,
            searchTerm:"",
        }
    },
    computed: {
        filterOptions() {
          if (this.catval === "professional") {
            return [
              { value: null , text: "None" },
              { value: "name", text: "Name" },
              { value: "service", text: "Service" },
              { value: "id", text: "ID" },
              { value: "status", text: "Status(approved,flagged)" },
            ];
          } else if (this.catval === "customer") {
            return [
              { value: null , text: "None" },
              { value: "name", text: "Name" },
              { value: "pincode", text: "Pincode" },
              { value: "id", text: "ID" },
              { value: "status", text: "Status(active,flagged)" },
            ];
          } else if (this.catval === "servicerequest") {
            return [
              { value: null , text: "None" },
              { value: "request_status", text: "Status" },
              { value: "rating", text: "Rating" },
              { value: "professional", text: "Professional" },
            ];
          }
          return [];
        },
        subfilterOptions(){
            if (this.catval === "servicerequest" && this.filterval === "request_status") {
                return [
                  { value: "Closed", text: "Closed" },
                  { value: "Requested", text: "Requested" },
                  { value: "Accepted", text: "Accepted" },
                  { value: "Rejected", text: "Rejected" },
                ];
              } else if (this.catval === "servicerequest" && this.filterval === "rating") {
                return [
                  { value: "1" , text: "1" },
                  { value: "2" , text: "2" },
                  { value: "3" , text: "3" },
                  { value: "4" , text: "4" },
                  { value: "5" , text: "5" },
                ];
              } 
              else if (this.catval === "servicerequest" && this.filterval === "professional") {
                let plist = this.servicelist.map((serv) => ({
                    value: serv.professional,
                    text: serv.professional,
                }));
                return plist;
            }
              return [];
        },
        filteredServiceList() {
            let filteredList = [...this.servicelist];
      
            if (this.filterval) {
                if (this.filterval==="rating"){
                    this.subfilterval= +this.subfilterval;
                }
              filteredList = filteredList.filter((service) =>
                service[this.filterval] === this.subfilterval
              );
            }
            return filteredList;
          },
          filteredCustomers() {
            if (this.searchTerm===""){
                return this.custlist;
            }
            const lowerSearchTerm = this.searchTerm.toLowerCase();
            return this.custlist.filter((cust) =>
                String(cust[this.filterval]).toLowerCase().startsWith(lowerSearchTerm)
            );
          },
          filteredProfessionals() {
            if (this.searchTerm===""){
                return this.proflist;
            }
            const lowerSearchTerm = this.searchTerm.toLowerCase();
            return this.proflist.filter((cust) =>
                String(cust[this.filterval]).toLowerCase().startsWith(lowerSearchTerm)
            );
          },
      },
      watch: {
        catval(newValue, oldValue) {
          this.filterval = null;
          this.subfilterval = null;
          this.searchTerm = "";
        },
        filterval(newValue, oldValue) {
            this.searchTerm = "";
          },
      },
    methods : {
        async fetchprofessionals(){
            const res = await fetch(location.origin + '/api/professional', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.proflist = await res.json();

        },
        async fetchcustomers(){
            const res = await fetch(location.origin + '/api/customer', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.custlist = await res.json();

        },
        async fetchservicerequests() {
            const res = await fetch(location.origin + '/api/servicerequest', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.servicelist = await res.json();
        },
        async flag(user_id) {
            const response = await fetch(`${location.origin}/api/user/${user_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "status": "flagged",
                }),
            });

            if (response.ok) {
                this.fetchcustomers();
                this.fetchprofessionals();
            } else {
                console.error('Failed to Flag User');
            }
        },
        async unflag(user_id,user) {
            let userstatus;
            if(user==='customer'){
                userstatus="active";
            }
            if(user==='prof'){
                userstatus="approved";
            }
            const response = await fetch(`${location.origin}/api/user/${user_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "status": userstatus,
                }),
            });

            if (response.ok) {
                this.fetchcustomers();
                this.fetchprofessionals();
            } else {
                console.error('Failed to Unflag User');
            }
        },
    },
    async mounted(){
        this.fetchprofessionals();
        this.fetchcustomers();
        this.fetchservicerequests();
    }
}