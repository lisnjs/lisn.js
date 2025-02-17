import {
  PopupComponent,
  PopupTriggerComponent,
  ModalComponent,
  ModalTriggerComponent,
} from "@lisn.js/react";
import "lisn.js/popup.css";
import "lisn.js/modal.css";

import { CodePager, CodePagerPage } from "./CodePager";
import { CodeCollection } from "./fetchCodeCollections";
import Link from "./Link";

import styles from "./demo-header.module.css";

export type DemoHeaderProps = {
  className?: string;
  collections: CodeCollection[];
};

export const DemoHeader = ({
  className = "",
  collections,
}: DemoHeaderProps) => {
  return (
    <header className={className}>
      <div className={styles.header}>
        <PopupTriggerComponent
          as="button"
          className={styles.popupTrigger}
          config={{ hover: true }}
        >
          View code
        </PopupTriggerComponent>
        <PopupComponent
          className={styles.menu}
          config={{ position: "bottom-right" }}
        >
          {collections.map((c) => {
            return (
              <ModalPager
                key={c.key}
                title={c.title}
                tabs={c.tabs}
                sandbox={c.sandbox}
              ></ModalPager>
            );
          })}
        </PopupComponent>
      </div>
    </header>
  );
};

const ModalPager = ({ title, tabs, sandbox }: CodeCollection) => {
  return (
    <div>
      <ModalTriggerComponent as="button" className={styles.trigger}>
        {title}
      </ModalTriggerComponent>
      <ModalComponent
        className={styles.content}
        config={{ className: styles.modal }} /* wrapper */
      >
        {sandbox && (
          <p className="text-center">
            Edit on{" "}
            <Link href={sandbox.url} external={true}>
              {sandbox.name}
            </Link>
          </p>
        )}
        <CodePager
          className={styles.pager}
          tabNames={tabs.map((t) => t.title)}
          fixedHeight={true}
        >
          {tabs.map((t) => {
            return (
              <CodePagerPage className={styles.page} key={t.key}>
                <pre>
                  <code>{t.code}</code>
                </pre>
              </CodePagerPage>
            );
          })}
        </CodePager>
      </ModalComponent>
    </div>
  );
};

export default DemoHeader;
