import HandleVIP from "../views/HandleVIP.vue";
import Home from "../views/Home.vue"
import ChannelList from "../views/ChannelList.vue";
import VipProfile from "../views/VipProfile.vue";
import SideBar from "../components/sideBar/SideBar.vue";
import ChannelProfile from "../components/channels/ChannelProfile.vue";
import statsPage from "../views/statsPage.vue";

export const routes =[
    {
        path:"/SMM",
        redirect:  { name: "Home" }
    },
    {
        path:"/SMM/",
        redirect:  { name: "Home" }
    },
    {
        path:"/SMM/home",
        name:'Home',
        components: {
            welcomingPage: Home
        },
    },
    {
        path:"/SMM/handlevip",
        name:'HandleVIP',
        components: {
            welcomingPage: HandleVIP
        },
    },
    {
        path: "/SMM/Profile",
        name: "Profile",
        components: {
            sideBar: SideBar,
            SbOn: VipProfile,
        },
    },
    {
        path: "/SMM/Channels",
        name:"Channels",
        components: {
            sideBar: SideBar,
            SbOn: ChannelList
        },
    },
    {
        path: "/SMM/Channels/:channelName" ,
        name:"channelView",
        components: {
            sideBar: SideBar,
            SbOn: ChannelProfile
        },
    },

    /*
    {
        path: "/SMM/:user/:vip/Messages",
        name:"Messages",
        components: {
            sideBar: SideBar,
            SbOn: Messages,
        },
    },

     */
    {
        path:  "/SMM/BuyQuota",
        name:"Quota",
        components: {
            sideBar: SideBar,
        },
    },
    {
        path: "/SMM/AddPost",
        name:"Post",
        components: {
            sideBar: SideBar,
        },
    },
    {
        path:"/SMM/*",
        redirect:  { name: "Home" }
    },
    {
        path: "/SMM/Stats",
        name:"Stats",
        components: {
            sideBar: SideBar,
            SbOn: statsPage
        },
    }
]



