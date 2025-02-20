const Home = {
    template: `
    <div>
        <div> <h2> Welcome to HomeAidConnect. </h2> </div>
        <h5>A platform where u can find onestop solution of your home service problems.</h5>
    </div>
    
    `
}



import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminDashboard from "../pages/AdminDashboard.js";
import store from "./store.js";
import CustomerDashboard from "../pages/CustomerDashboard.js";
import ProfessionalDashboard from "../pages/ProfessionalDashboard.js";
import ManageServices from "../pages/ManageServices.js";
import ProfilePage from "../pages/ProfilePage.js";
import CustomerProfilePage from "../pages/CustomerProfilePage.js";
import Payment from "../pages/Payment.js";
import AdminStats from "../pages/AdminStats.js";
import AdminSearch from "../pages/AdminSearch.js";
import CustomerSearch from "../pages/CustomerSearch.js";
import ProfessionalSearch from "../pages/ProfessionalSearch.js";


const routes = [
    { path: '/', component: Home },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/admindashboard', component: AdminDashboard, meta: { requiresLogin: true, role: "admin" } },
    { path: '/adminstats', component: AdminStats, meta: { requiresLogin: true, role: "admin" } },
    { path: '/adminsearch', component: AdminSearch, meta: { requiresLogin: true, role: "admin" } },
    { path : '/customerdashboard', component : CustomerDashboard, meta : { requiresLogin:true, role : "customer"}},
    { path : '/customersearch', component : CustomerSearch, meta : { requiresLogin:true, role : "customer"}},
    { path : '/professionaldashboard', component : ProfessionalDashboard, meta : { requiresLogin:true, role : "service proffesional"}},
    { path : '/manageservices', component : ManageServices, meta: { requiresLogin: true, role: "admin" }},
    { path : '/professionalprofile', component : ProfilePage, meta : { requiresLogin:true, role : "service proffesional"}},
    { path : '/professionalsearch', component : ProfessionalSearch, meta : { requiresLogin:true, role : "service proffesional"}},
    { path : '/customerprofile', component : CustomerProfilePage, meta : { requiresLogin:true, role : "customer"}},
    { path: '/payment/:req_id', component: Payment,meta : { requiresLogin:true, role : "customer"} },
]



const router = new VueRouter({
    routes
})


router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)) {
        if (!store.state.loggedin) {
            next({ path: '/login' });
        } else if (to.meta.role && to.meta.role != store.state.role) {
            alert('role not authorized');
            if(store.state.role=="admin"){
                next({ path: "/admindashboard" });
            }
            if(store.state.role=="customer"){
                next({ path: "/customerdashboard" });
            }
            if(store.state.role=="service proffesional"){
                next({ path: '/professionaldashboard'});
            }
        } else {
            next();
        }
    } else {
        next();
    }
})



export default router;