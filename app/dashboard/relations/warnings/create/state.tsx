import { SelectDemo } from "@/components/app/select";
import { WarningStateType } from "@/types";
import { Dispatch, FC, SetStateAction } from "react";

interface WarningStateProps {
  warningState: string;
  setWarningState: Dispatch<SetStateAction<string>>;
  data: WarningStateType[];
}

const WarningState: FC<WarningStateProps> = ({
  warningState,
  data,
  setWarningState,
}) => {
  return (
    <SelectDemo
      value={warningState}
      setData={setWarningState}
      data={data}
      title={"Warnings"}
      placeholder={"Choose Warning Type"}
    />
  );
};

export default WarningState;
