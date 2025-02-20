export default {
    template: `
    <div>
        <div>Email: <input placeholder="email" v-model="email"/></div>
        <div>Password: <input placeholder="password" type="password" v-model="password"/></div>
        <button :disabled="!isformvalid" @click="submitlogin"> Submit </button>
    </div>
    `,
    data() {
        return {
            email: null,
            password: null,
        }
    },
    computed: {
        isformvalid() {
            return this.email && this.password;
        }
    },
    methods: {
        async submitlogin() {
            try {
                const res = await fetch(location.origin + '/login', { method: "POST", headers: { 'content-type': 'application/json' }, body: JSON.stringify({ 'email': this.email, 'password': this.password }) })
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('user',JSON.stringify(data));

                    this.$store.commit('setUser');
                    if(this.$store.state.role=="admin"){
                        this.$router.push('/admindashboard');
                    }
                    if(this.$store.state.role=="customer"){
                        this.$router.push('/customerdashboard');
                    }
                    if(this.$store.state.role=="service proffesional"){
                        this.$router.push('/professionaldashboard');
                    }
                }
                else{
                    const errordata = await res.json();
                    alert("MESSAGE : " +errordata.message);
                }
            }catch(error){
                alert("Something went wrong");
            } 
        }
    }
}