import { MdPostAdd, MdAccessTime } from 'react-icons/md';

import classes from './MainHeader.module.css';

function MainHeader({ onCreatePost }) {
  return (
    <header className={classes.header}>
      <h1 className={classes.logo}>
        <MdAccessTime />
        Rezervacija termina
      </h1>
      <p>
        <button className={classes.button} onClick={onCreatePost}>
          <MdPostAdd size={18} />
          Novi
        </button>
      </p>
    </header>
  );
}

export default MainHeader;