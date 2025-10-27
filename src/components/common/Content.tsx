import styles from "./Content.module.css";

export default function Content({ content }: { content: string }) {
  return (
    <div
      id="post-content"
      className={styles.root}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: rendering trusted, pre-sanitized markdown HTML
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
