import { SortableComponent, SortableItemComponent } from "@lisn.js/react";
import "lisn.js/sortable.css";

import styles from "./demo.module.css";

export default function Page() {
  return (
    <>
      <div className={styles.wrapper}>
        <SortableComponent className={styles.demo} config={{ mode: "swap" }}>
          <SortableItemComponent
            className={[styles.box, styles.r1, styles.c4].join(" ")}
          >
            <span className={styles.letter}>N</span>
          </SortableItemComponent>
          <SortableItemComponent
            className={[styles.box, styles.r2, styles.c2].join(" ")}
          >
            <span className={styles.letter}>I</span>
          </SortableItemComponent>
          <SortableItemComponent
            className={[styles.box, styles.r1, styles.c2].join(" ")}
          >
            <span className={styles.letter}>I</span>
          </SortableItemComponent>
          <SortableItemComponent
            className={[styles.box, styles.r2, styles.c1].join(" ")}
          >
            <span className={styles.letter}>L</span>
          </SortableItemComponent>

          <div>{/* dummy */}</div>

          <SortableItemComponent
            className={[styles.box, styles.r2, styles.c4].join(" ")}
          >
            <span className={styles.letter}>N</span>
          </SortableItemComponent>
          <SortableItemComponent
            className={[styles.box, styles.r1, styles.c1].join(" ")}
          >
            <span className={styles.letter}>L</span>
          </SortableItemComponent>
          <SortableItemComponent
            className={[styles.box, styles.r2, styles.c3].join(" ")}
          >
            <span className={styles.letter}>S</span>
          </SortableItemComponent>
          <SortableItemComponent
            className={[styles.box, styles.r1, styles.c3].join(" ")}
          >
            <span className={styles.letter}>S</span>
          </SortableItemComponent>

          <div className={[styles.line, styles.lineV].join(" ")}></div>
          <div className={[styles.line, styles.lineH].join(" ")}></div>
        </SortableComponent>
      </div>
    </>
  );
}
