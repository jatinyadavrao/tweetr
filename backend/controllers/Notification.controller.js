const Notification = require("../models/Notification.model");
const User = require("../models/User.model");

const sendNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const senderUser = await User.findById(req.user.id);

        const existingNotification = await Notification.findOne({
            sender: req.user.id,
            receiver: id,
            status: "Pending"
        });

        if (existingNotification) {
            return res.json({
                success: false,
                message: "A pending friend request already exists."
            });
        }

        const notificationBody = {
            sender: req.user.id,
            receiver: id,
            status: "Pending",
            message: `${senderUser.username} wants to send you a message`
        };

        const notification = await Notification.create(notificationBody);

        res.json({
            success: true,
            message: "Friend Request Sent Successfully",
            data: notification
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in Creating Notification"
        });
    }
};
const fetchNotifications = async(req,res)=>{
    try {
        const notifications = await Notification.find({receiver:req.user.id});
        return res.json({
            success:true,
            message:"Notifications Fetched Successfully",
            data:notifications
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"Error in fetching Notifications"
        })
    }

}
const acceptNotification = async(req,res)=>{
    try {
          const {id} = req.params;
          const accNot= await Notification.findOneAndUpdate({_id:id},{status:"Accepted"},{new:true});
          if(!accNot) return res.json({message:"no notification found of this id"})
          const newUser = await User.findByIdAndUpdate(accNot.sender,{$push:{friends:accNot.receiver}},{new:true})
          const newUser2 = await User.findByIdAndUpdate(accNot.receiver,{$push:{friends:accNot.sender}},{new:true})
          const notdel = await Notification.findOneAndDelete({_id:accNot._id})
          return res.json({
            success:true,
            message:"Message Request Accepted"
          });
    } catch (error) {
        return res.json({
            success:false,
            message:"Error in Accepting Notification"
        })
    }
}
const rejectNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notific = await Notification.findOneAndUpdate({ _id: id }, { status: "Rejected" }, { new: true });
        if (!notific) return res.json({
            success: false,
            message: "No Notification Found of this Id"
        });
        await Notification.findByIdAndDelete(notific._id);
        return res.json({
            success: true,
            message: "Message Request Rejected"
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error in Rejecting Notification"
        });
    }
};

module.exports = {sendNotification,fetchNotifications,acceptNotification,rejectNotification}