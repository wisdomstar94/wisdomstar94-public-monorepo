import styles from './page.module.scss';

export default function Page() {
  return (
    <>
      <div className={styles['box2']} style={{ backgroundColor: '#f00', color: '#fff' }}>
        box
      </div>
    </>
  );
}