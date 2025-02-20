export default {
    template: `
    <div>
    <h3>Email Id : {{cust?.email}}</h3>
    <div>Name : {{cust?.name}} </div>
    <div>Phone : {{cust?.phone}} </div>
    <div>Pincode : {{cust?.pincode}} </div>
    <div>Address : {{cust?.address}} </div>
    </div>
    `,
    data() {
        return {
            cust: null,
        }
    },
    methods: {
        async fetchcustomer() {
            const res = await fetch(`${location.origin}/api/user/${this.$store.state.user_id}`, { method: "GET" });
            this.cust = await res.json();
        },
    },
    async mounted() {
        this.fetchcustomer();
    }
}