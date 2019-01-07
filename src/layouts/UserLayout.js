import React from 'react';
import Link from 'umi/link';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';


class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      <DocumentTitle title='智能窨井管理系统'>
        <div className={styles.container}>
          {/* <div className={styles.lang}>
            <SelectLang />
          </div> */}
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <span className={styles.title}>智能窨井管理系统</span>
                </Link>
              </div>
              <div className={styles.desc}>基于物联网技术的实时窨井监控警报系统</div>
            </div>
            {children}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
