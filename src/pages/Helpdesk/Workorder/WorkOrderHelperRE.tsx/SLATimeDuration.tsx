import { Card } from 'primereact/card'
import React, { useEffect, useState } from 'react'
import DateTimeDisplay from '../DateTimeDisplay'
import CountdownTimer from '../ShowCounter';
import timeIcon from "../../../../assest/images/bx-time.png";

export const SLATimeDuration = ({ slaTimeDetails, currentStatus, getOptionDetailsOverdue }: any) => {

    const [dateTimeAfterThreeDays, setDateTimeAfterThreeDays] = useState<number | null>(null);
    const [CompDays, setCompDays] = useState<any | null>(0);
    const [CompHours, setCompHours] = useState<any | null>(0);
    const [CompMinutes, setCompMinutes] = useState<any | null>(0);
    const [CompSeconds, setCompSeconds] = useState<any | null>(0);
    const initialTime =
        slaTimeDetails?.CURRUENT_TIME !== null
            ? new Date(slaTimeDetails.CURRUENT_TIME)
            : new Date();
    function getCountdown() {
        const date =
            currentStatus === 1
                ? slaTimeDetails?.ACKNOWLEDGED_WITHIN_MS
                : currentStatus === 3
                    ? slaTimeDetails?.RECTIFIED_WITHIN_MS
                    : currentStatus === 5 && slaTimeDetails?.RECTIFIED_WITHIN_MS === null
                        ? slaTimeDetails?.ACKNOWLEDGED_WITHIN_MS
                        : slaTimeDetails?.RECTIFIED_WITHIN_MS;

        const NOW_IN_MS = slaTimeDetails?.CURRENT_TIME_MS;

        const gettime = NOW_IN_MS - date;
        const finalTime = NOW_IN_MS - gettime;

        setDateTimeAfterThreeDays(finalTime);
    }
    const getStatus = (date: string | null, time: Date) => {
        if (date == null) return "NA";
        const dateObj = new Date(date);
        if (dateObj < time) return "Overdue";
        return "";
    };
    const getRectifiedStatus = () => {
        if (
            currentStatus === 3 ||
            (currentStatus === 5 && slaTimeDetails?.RECTIFIED_WITHIN != null)
        ) {
            return getStatus(slaTimeDetails?.RECTIFIED_WITHIN, initialTime);
        }
        return "";
    };
    const getAcknowledgedStatus = () => {
        if (
            currentStatus === 1 ||
            (currentStatus === 5 && slaTimeDetails?.RECTIFIED_WITHIN == null)
        ) {
            return getStatus(slaTimeDetails?.ACKNOWLEDGED_WITHIN, initialTime);
        }
        return "";
    };
    const getSLABoxStatus = () => {
        const SLAboxStatus =
            currentStatus === 1 ||
                (currentStatus === 5 && slaTimeDetails?.RECTIFIED_WITHIN == null)
                ? getAcknowledgedStatus()
                : getRectifiedStatus();
        return SLAboxStatus;
    };
    function getCountdownNew() {
        const date = slaTimeDetails?.RECTIFIED_AT_MS;
        const NOW_IN_MS = slaTimeDetails?.REPORTED_AT_MS;
        const countDown = date - NOW_IN_MS;
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        setCompDays(days);
        setCompHours(hours);
        setCompMinutes(minutes);
        setCompSeconds(seconds);
        //setDateTimeAfterThreeDaysNew(finalTime);
    }
    useEffect(() => {
        if (currentStatus) {
            if (
                slaTimeDetails?.RECTIFIED_WITHIN !== undefined ||
                slaTimeDetails?.ACKNOWLEDGED_WITHIN !== undefined
            ) {
                if (
                    slaTimeDetails?.RECTIFIED_WITHIN !== null ||
                    slaTimeDetails?.ACKNOWLEDGED_WITHIN !== null
                ) {
                    getCountdown();
                }
            }
        }
    }, [
        slaTimeDetails?.RECTIFIED_WITHIN,
        slaTimeDetails?.ACKNOWLEDGED_WITHIN,
        currentStatus,
    ]);
    useEffect(() => {
        getCountdownNew();
    }, [slaTimeDetails?.RECTIFIED_AT_MS]);
    return (
        <>
            {currentStatus !== 7 &&
                currentStatus !== 6 &&
                currentStatus !== 4 ? (
                <Card>
                    <div className="flex justify-between">
                        <div className=" ">
                            <h6 className="Service_Header_Text">SLA Duration</h6>
                            <p className="Text_Secondary Helper_Text ">
                                {`${(currentStatus === 1 ||
                                    (currentStatus === 5 &&
                                        slaTimeDetails?.RECTIFIED_WITHIN == null)) &&
                                    new Date(slaTimeDetails?.ACKNOWLEDGED_WITHIN) >=
                                    initialTime
                                    ? "Acknowledge within"
                                    : (currentStatus === 3 ||
                                        (currentStatus === 5 &&
                                            slaTimeDetails?.RECTIFIED_WITHIN !=
                                            null)) &&
                                        new Date(slaTimeDetails?.RECTIFIED_WITHIN) >=
                                        initialTime
                                        ? "Rectify within"
                                        : ""
                                    }`}

                            </p>
                            {dateTimeAfterThreeDays !== null &&
                                (currentStatus === 7 ||
                                    currentStatus === 6 ||
                                    currentStatus === 4) ? (
                                <></>
                            ) : (
                                <CountdownTimer
                                    getOptionDetails={getOptionDetailsOverdue}
                                    targetDate={dateTimeAfterThreeDays}
                                    current_time={slaTimeDetails?.CURRENT_TIME_MS}
                                />
                            )}

                            <div className="flex justify-between">
                                <h6 className="Text_Main">{getSLABoxStatus()}</h6>
                            </div>
                        </div>
                        <div>
                            <img src={timeIcon} alt="" />
                        </div>
                    </div>
                </Card>
            ) : (
                <></>
            )}

            {currentStatus === 7 || currentStatus === 4 ? (
                <Card>
                    <div className="flex justify-between">
                        <div className=" ">
                            <h6 className="Service_Header_Text">SLA Duration</h6>
                            <p className="Text_Secondary Helper_Text ">
                                Total Spent Time
                            </p>

                            <div className="show-counter">
                                <div className="countdown-link">
                                    <DateTimeDisplay
                                        value={CompDays}
                                        type={"Days"}
                                        isDanger={CompDays <= 3}
                                    />
                                    <p>:</p>
                                    <DateTimeDisplay
                                        value={CompHours}
                                        type={"Hours"}
                                        isDanger={false}
                                    />
                                    <p>:</p>
                                    <DateTimeDisplay
                                        value={CompMinutes}
                                        type={"Mins"}
                                        isDanger={false}
                                    />
                                    <p>:</p>
                                    <DateTimeDisplay
                                        value={CompSeconds}
                                        type={"Seconds"}
                                        isDanger={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <img src={timeIcon} alt="" />
                        </div>
                    </div>
                </Card>
            ) : (
                <></>
            )}
        </>
    )
}
