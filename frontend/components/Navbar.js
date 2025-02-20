export default {
    template : `
    <div>
        <h1> HomeAidConnect </h1>
        <router-link v-if="!$store.state.loggedin" to='/'>Home</router-link>
        <router-link v-if="!$store.state.loggedin" to='/login'>Login</router-link>
        <router-link v-if="!$store.state.loggedin" to='/register'>Register</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'admin'" to='/admindashboard'>Admin Dashboard |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'admin'" to='/manageservices'>Manage Services |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'admin'" to='/adminsearch'>Search |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'admin'" to='/adminstats'>Statical Summary |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'customer'" to='/customerdashboard'>Dashboard |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'customer'" to='/customersearch'>Search |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'service proffesional'" to='/professionaldashboard'>Dashboard |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'service proffesional'" to='/professionalprofile'>Profile |</router-link>
        <router-link v-if="$store.state.loggedin && $store.state.role == 'service proffesional'" to='/professionalsearch'>Search |</router-link>
        <button class="btn btn-secondary" v-if="$store.state.loggedin" @click="logoutredirect"  style="background-color: Red; color: White;">Logout</button>
    </div>
    `,
    methods:{
        logoutredirect(){
            this.$store.commit('logout');
            this.$router.push('/');
        }
    },
}
