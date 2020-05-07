import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import AttendeeTableRow from "./AttendeeTableRow";
import ls from "local-storage";

const AttendeeTable = ({ attendees, activeMeeting }) => {
    const clickHandler = (email) => {
        const bodyObject = { email };
        if (ls.get("token")) {
            bodyObject.token = ls.get("token");
        } else if (ls.get("code")) {
            bodyObject.code = ls.get("code");
        }

        fetch("/api/grantpermission/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(bodyObject),
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error("error");
                }
            })
            .then((res) => {
                if (res.url) {
                    window.open(res.url);
                }
                if (res.token) {
                    ls.set("token", res.token);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    return (
        <div className={styles.attendeeTable}>
            <div className={styles.attendeeTableBoxLeft}>
                <span className={styles.attendeeTableTitle}>name</span>
            </div>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableTitle}>role</span>
            </div>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableTitle}>here?</span>
            </div>
            {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return attendee.userId.newMember;
                    })
                    .map((attendee) => {
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                isNewMember={true}
                                clicked={() =>
                                    clickHandler(attendee.userId.email)
                                }
                            ></AttendeeTableRow>
                        );
                    })}
            {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return (
                            !attendee.userId.newMember &&
                            attendee.userId.name.firstName !== "test"
                        );
                    })
                    .map((attendee) => {
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                present={true}
                            ></AttendeeTableRow>
                        );
                    })}
            {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return (
                            !attendee.userId.newMember &&
                            attendee.userId.name.firstName === "test"
                        );
                    })
                    .map((attendee) => {
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                present={false}
                            ></AttendeeTableRow>
                        );
                    })}
        </div>
    );
};

export default AttendeeTable;