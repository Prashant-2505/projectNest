const { default: mongoose } = require("mongoose");

const ticketSchame = mongoose.Schema({
    ticket: { type: String, required: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
    resolvedMember: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }],
    resolved: { type: String, default: null }
},
    { timestamps: true });

const TicketModel = mongoose.models.TicketModel || mongoose.model('TicketModel', ticketSchame);

export default TicketModel