import React from 'react'
import noDataIcon from "../../../../assest/images/nodatafound.png";
export default function NoItemToShow() {
    return (
        <div className="flex items-center mt-2 justify-center w-full">
            <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-24 border-2
                                      border-gray-200 border rounded-lg  "
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <img
                        src={noDataIcon}
                        alt=""
                        className="w-12"
                    />
                    <p className="mb-2 mt-2 text-sm ">
                        <span className="Text_Primary Alert_Title">
                            {("No items to show")}{" "}
                        </span>
                    </p>
                </div>
            </label>
        </div>
    )
}
