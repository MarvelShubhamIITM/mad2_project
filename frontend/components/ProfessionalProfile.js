export default {
    template: `
    <div>
    <h3>Email Id : {{prof?.email}}</h3>
    <div>Name : {{prof?.name}} </div>
    <div>Phone : {{prof?.phone}} </div>
    <div>Experience : {{prof?.experience}} </div>
    <div>Rating : {{prof?.average_rating}} </div>
    <div>Bank_acc : {{prof?.bank_acc}} </div>
    <div>Adhaar_no : {{prof?.adhaar_no}} </div>
    <div>Pincode : {{prof?.pincode}} </div>
    <div>Service : {{prof?.service}} </div>
    <div>Service Description : {{prof?.description}}</div>
    <div>Service Price : {{prof?.service_price}} </div>
    </div>
    `,
    data() {
        return {
            prof: null,
        }
    },
    methods: {
        async fetchprofessional() {
            const res = await fetch(`${location.origin}/api/user/${this.$store.state.user_id}`, { method: "GET" });
            this.prof = await res.json();
        },
    },
    async mounted() {
        this.fetchprofessional();
    }
}