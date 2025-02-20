import ProfessionalProfile from "../components/ProfessionalProfile.js"



export default {
    template: `
    <div>
        <ProfessionalProfile :key="profileKey" />
    <button v-if="!update" @click="toupdate"  style="background-color: blue; color: white;">Edit</button>
    <div v-if="update" style="border:2px solid black;width:350px">
    Update <button @click="close"> X </button>
    <div>Note:Only fill fields which need to update!</div>
    <div>Name: <input v-model="name"/></div>
    <div>Phone: <input v-model="phone"/></div>
    <div>Experience: <input v-model="experience"/></div>
    <div>Bank_acc: <input v-model="bank_acc"/></div>
    <div>Adhaar_no: <input v-model="adhaar_no"/></div>
    <div>Pincode: <input v-model="pincode"/></div>
    <div>Service: 
         <select v-model="service">
        <option v-for="option in servicelist" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
        </div>
    <div> Service Description: <input v-model="description"/></div>
    <div> Service Price: <input v-model="service_price"/></div>
    <button @click="updated">Update</button>
    </div>
    </div>
    `,
    data() {
        return {
            phone: null,
            name: null,
            pincode: null,
            description: null,
            service: null,
            experience: null,
            bank_acc: null,
            adhaar_no: null,
            servicelist: [],
            update:false,
            profileKey:0,
            service_price:null
        }
    },
    methods :{
        async toupdate(){
            this.update=true;
        },
        async close(){
            this.update=false;
        },
        async updated() {
            const response = await fetch(`${location.origin}/api/user/${this.$store.state.user_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    "phone": this.phone,
                    "name": this.name,
                    "pincode": this.pincode,
                    "description": this.description,
                    "service": this.service,
                    "experience": this.experience,
                    "bank_acc": this.bank_acc,
                    "adhaar_no": this.adhaar_no,
                    "service_price":this.service_price
                }),
            });

            if (response.ok) {
                this.profileKey += 1;
                this.update = false;
            } else {
                console.error('Failed to update profile');
            }
        },
    },
    components: {
        ProfessionalProfile,
    },
    async mounted() {
        const res = await fetch(location.origin + '/api/service', { method: "GET", headers: { 'Authentication-Token': this.$store.state.auth_token } });
        this.servicelist = await res.json();
    }
}