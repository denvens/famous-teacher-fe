import mine from '../pages/mine/index';
import TicketNum from '../pages/mine/ticketNumber';
import Scholarship from '../pages/mine/scholarship';
import BuyDetail from '../pages/mine/buyDetail';
import Logistics from '../pages/mine/logistics';
import ExpressDetail from '../pages/mine/expressDetail';
export default [{
    path: '/mine/index',
    component: mine
},{
    path: '/ticketNum',
    component: TicketNum
},
{
    path: '/scholarship',
    component: Scholarship
},
{
    path: '/buyDetail',
    component: BuyDetail
},
{
    path: '/logistics',
    component: Logistics
},
{
    path: '/expressDetail/:levelId',
    component: ExpressDetail
}
];