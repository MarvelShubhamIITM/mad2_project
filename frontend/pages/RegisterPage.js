export default {
    template: `
    <div>
        <div>Email: <input placeholder="email" v-model="email" required/></div>
        <div>Password: <input placeholder="password" type="password" v-model="password" required/></div>
        <div>
          <label>
            <input type="radio" v-model="role" value="Proffesional"/> Proffesional
          </label>
          <label>
            <input type="radio" v-model="role" value="Customer"/> Customer
          </label>
        </div>
        <div v-if="role==='Proffesional'">
        <div>Name: <input placeholder="name" v-model="name"/></div>
        <div>Contact: +91 <input placeholder=" XXXXX-XXXXX" v-model="phone"/></div>
        <div>Pincode: <input v-model="pincode"/></div>
        <div>Service: 
         <select v-model="service">
        <option v-for="option in servicelist" :key="option.id" :value="option.id">
          {{ option.name }} {{option.price}} {{option.description}}
        </option>
      </select>
      </div>
        <div>Service Description: <input placeholder="description" v-model="description"/></div>
        <div>Service Price: <input placeholder="price(>=base price)" v-model="service_price"/></div>
        <div>Experience: <input placeholder="experience" v-model="experience"/></div>
        <div>Bank Account: <input placeholder=" 1234 XXXX XXXX XXXX" v-model="bank_acc"/></div>
        <div>Adhaar number: <input placeholder="1234 XXXX XXXX" v-model="adhaar_no" required/></div>
        <div>Upload Image: <input type="file" @change="handleFileUpload('pfp', $event)" accept="image/*" /> </div>
        <div>Upload Douments: <input type="file" @change="handleFileUpload('docs', $event)" accept=".pdf,.doc,.docx,.txt" /> </div>
        </div>
        <div v-if="role==='Customer'">
        <div>Name: <input placeholder="name" v-model="name" required/></div>
        <div>Contact: +91 <input placeholder=" XXXXX-XXXXX" v-model="phone" required/></div>
        <div>Address: <input v-model="address" required/></div>
        <div>Pincode: <input v-model="pincode" required/></div>
        </div>
        <button :disabled="!isformvalid" @click="submitlogin"> Register </button>
    </div>
    `,
    data() {
        return {
            email: null,
            password: null,
            role: null,
            phone: null,
            name: null,
            pincode: null,
            description: null,
            service: null,
            service_price:null,
            address: null,
            experience: null,
            bank_acc: null,
            adhaar_no: null,
            pfp: null,
            docs: null,
            servicelist:[]
        }
    },
    computed: {
        isformvalid() {
            if (this.role == "Customer") {
                return this.email && this.password && this.pincode && this.phone && this.name && this.address;
            }
            if (this.role == "Proffesional") {
                return this.email && this.password && this.pincode && this.phone && this.name && this.bank_acc && this.adhaar_no && this.description && this.experience && this.service && this.service_price;
            }
        }

    },
    methods: {
        handleFileUpload(field, event) {
            this[field] = event.target.files[0];
        },
        async submitlogin() {
            try {
                const formdata = new FormData();
                if (this.pfp) formdata.append("pfp", this.pfp);
                if (this.docs) formdata.append("docs", this.docs);
                const metadata = {
                    'role': this.role,
                    'phone': this.phone,
                    'name': this.name,
                    'pincode': this.pincode,
                    'description': this.description,
                    'service': this.service,
                    'address': this.address,
                    'experience': this.experience,
                    'bank_acc': this.bank_acc,
                    'adhaar_no': this.adhaar_no,
                    'service_price':this.service_price
                };
                formdata.append("metadata", JSON.stringify(metadata));
                const res = await fetch(location.origin + '/register', { method: "POST", headers: {'Content-Type': 'application/json',},body: JSON.stringify({ "email": this.email, "password": this.password, "role": this.role })});
                if (res.ok) {
                    try {
                        const result = await res.json();
                        const user_id = result.user_id;
                        const res1 = await fetch(`${location.origin}/api/user/${user_id}`,{method:"POST",body:formdata});
                        
                        if(res1.ok){
                            alert("user has been registered.");
                            this.$router.push('/login');
                        }
                        else{
                            const errordata1 = await res1.json();
                            alert("ERROR:" + errordata1.message);
                        }
                    }catch(error){
                        alert("Something went wrong");
                    }
                    }
                else {
                    const errordata = await res.json();
                    alert("ERROR:" + errordata.message);
                }
            } catch (error) {
                alert("Something went wrong");
            }
        }
    },
    async mounted(){
        const res = await fetch(location.origin + '/api/service', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
        this.servicelist = await res.json();
    }
}