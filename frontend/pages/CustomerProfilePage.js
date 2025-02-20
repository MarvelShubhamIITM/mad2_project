import CustomerProfile from "../components/CustomerProfile.js";

export default{
    template :`
    <div>
        <CustomerProfile :key="profileKey" />
    <button v-if="!update" @click="toupdate">Edit</button>
    <div v-if="update" style="border:2px solid black;width:350px">
    Update <button @click="close"> X </button>
    <div>Note:Only fill fields which need to update!</div>
    <div>Name: <input v-model="name"/></div>
    <div>Phone: <input v-model="phone"/></div>
    <div>Pincode: <input v-model="pincode"/></div>
    <div>Address: <input v-model="address"/></div>
    <button @click="updated">Update</button>
    </div>
    </div>
    `,
    data(){
        return {
            profileKey:0,
            name:null,
            pincode:null,
            address:null,
            phone:null,
            update:false,
        }
    },
    components: {
        CustomerProfile,
    },
    methods:{
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
                    "address": this.address,
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

}