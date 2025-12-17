import Image from "next/image";
import Link from "next/link";
import styles from "./EventCard.module.css";
import type { EventData } from "../data/eventData";

interface EventCardProps {
  event: EventData;
  status: "진행중" | "진행종료";
}

export default function EventCard({ event, status }: EventCardProps) {
  return (
    <Link href={`/event/${event.id}`} className={styles.eventCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={event.image}
          alt={event.title}
          width={300}
          height={200}
          className={styles.eventImage}
        />
      </div>
      <div className={styles.eventInfo}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <div className={styles.statusWrapper}>
          <span
            className={`${styles.statusBadge} ${
              status === "진행중" ? styles.ongoing : styles.ended
            }`}
          >
            {status}
          </span>
          <span className={styles.eventDate}>
            {event.startDate}~{event.endDate}
          </span>
        </div>
      </div>
    </Link>
  );
}
