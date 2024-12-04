import mongoose, { model, Schema } from "mongoose";
import EmployeeModel from "../employees/model";

const tableColumnSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  title: String,
  columns: { type: Schema.Types.Mixed },
});

const TableColumnModel =
  mongoose.models.TableColumn || model("TableColumn", tableColumnSchema);

export default TableColumnModel;
