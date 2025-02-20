export default {
    template: `
    <div>
    <div>
       <h4> Current Services :</h4>
       <div v-for="(service,index) in services">
            <p>{{index+1}}. {{service.name}} {{service.price}} {{service.time}} <button @click="updateservice(service)">Update</button> | <button @click="deleteservice(service.id)">Delete</button> </p>
       </div>
       <button @click="addservice">+ Add Service </button>
    </div>
    <div v-if="add" style="border:2px solid black;width:300px">
        New service <button @click="close"> X </button>
        <div>Name: <input placeholder="name" v-model="name"/></div>
        <div>Price: <input placeholder="price (INR)" v-model="price"/></div>
        <div>Time: <input placeholder="time (hrs)" v-model="time"/></div>
        <div>Description: <input placeholder="description" v-model="description"/></div>
        <button :disabled="!isformvalid" @click="submitservice"> Add </button>
    </div>
    <div v-if="update" style="border:2px solid black;width:300px">
        Update service <button @click="closeu"> X </button>
        <div>Name: <input v-model="uname"/></div>
        <div>Price: <input v-model="uprice"/></div>
        <div>Time: <input v-model="utime"/></div>
        <div>Description: <input v-model="udescription"/></div>
        <button :disabled="!isformvalidu" @click="updatedservice"> Update </button>
    </div>
    </div>
    `,
    data() {
        return {
            add:false,
            services: [],
            name:null,
            price:null,
            time:null,
            description:null,
            update:false,
            uservice:null,
            uname:null,
            uprice:null,
            utime:null,
            udescription:null,
        }
    },
    computed :{
        isformvalid(){
            return this.name && this.price && this.description && this.time;
        },
        isformvalidu(){
            return this.uname && this.uprice && this.udescription && this.utime;
        }
    },
    methods: {
        addservice(){
            this.add=true;
        },
        updateservice(ser){
            this.update=true;
            this.uservice=ser.id;
            this.uname=ser.name;
            this.uprice=ser.price;
            this.utime=ser.time;
            this.udescription=ser.description;
        },
        close(){
            this.add=false;
            this.name=null;
            this.price=null;
            this.time=null;
            this.description=null;
        },
        closeu(){
            this.update=false;
        },
        async submitservice(){
            try{
                const formdata = new FormData();
                if (this.name) formdata.append('name',this.name);
                if (this.price) formdata.append('price',this.price);
                if (this.time) formdata.append('time',this.time);
                if (this.description) formdata.append('description',this.description);
                const res = await fetch(location.origin + '/api/service', { method: "POST",headers: { 'Authentication-Token': this.$store.state.auth_token },body: formdata});
                if(res.ok){
                    alert("New service added.");
                    this.add=false;
                    this.name=null;
                    this.price=null;
                    this.time=null;
                    this.description=null;
                    this.fetchservice();
                }
                else{
                    alert("Failed to add service");
                }
            }catch(error){
                alert("something went wrong")
            }
        },
        async fetchservice(){
            const res = await fetch(location.origin + '/api/service', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
            this.services = await res.json();
        },
        async updatedservice(){
            try{
                const formdata = new FormData();
                if (this.uname) formdata.append('name',this.uname);
                if (this.uprice) formdata.append('price',this.uprice);
                if (this.utime) formdata.append('time',this.utime);
                if (this.udescription) formdata.append('description',this.udescription);
                formdata.append('sid',this.uservice);
                const res = await fetch(location.origin + '/api/service', { method: "PUT",headers: { 'Authentication-Token': this.$store.state.auth_token },body: formdata});
                if(res.ok){
                    alert("Service Updated.");
                    this.fetchservice();
                    this.update=false;
                }
                else{
                    alert("Failed to update service");
                }
            }catch(error){
                alert("something went wrong")
            }
        },
        async deleteservice(did){
            const conf= confirm("Are u sure to delete this service.");
            if (conf){
                try{
                    const res = await fetch(location.origin + '/api/service', { method: "DELETE", headers: { 'content-type': 'application/json','Authentication-Token': this.$store.state.auth_token }, body: JSON.stringify({ 'sid' : did }) });
                    this.fetchservice();
                    alert("Service Deleted.");
                }catch(error){
                    alert("Failed to delete service.");
                }
            }
            else{
                return;
            }
        },
    },
    async mounted() {
        this.fetchservice();
    },

}