const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Ime mora biti popunjeno"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Prezime mora biti popunjeno"],
    trim: true,
  },
  index: {
    type: String,
    required: [true, "Indeks mora biti popunjen"],
    trim: true,
    validate: {
      validator: function (v) {
        return /\b[a-zA-Z]{1,2}[0-9]{0,1}[\s]?[0-9]{1,3}-[0-9]{4}\b/.test(v);
      },
      message: (index) => `'${index.value}' nije validan format za indeks`,
    },
  },
});

module.exports = mongoose.model("Student", StudentSchema);
