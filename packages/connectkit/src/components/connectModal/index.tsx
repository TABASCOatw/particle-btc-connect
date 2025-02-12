import { useState } from 'react';
import { type BaseConnector } from '../../connector/base';
import { useConnectProvider } from '../../context';
import back from '../../icons/back.svg';
import close from '../../icons/close.svg';
import retryIcon from '../../icons/retry.svg';
import styles from './index.module.scss';

const ConnectModal = ({ connectors }: { connectors: BaseConnector[] }) => {
  const [backVisible, setBackVisible] = useState(false);
  const [retryVisible, setRetryVisible] = useState(false);
  const [selectConnector, setSelectConnector] = useState<BaseConnector>();
  const { closeConnectModal, setConnectorId } = useConnectProvider();

  const onConnect = async (connector: BaseConnector) => {
    setBackVisible(true);
    setSelectConnector(connector);
    try {
      const accounts = await connector.requestAccounts();
      if (accounts.length > 0) {
        localStorage.setItem('current-connector-id', connector.metadata.id);
        setConnectorId(connector.metadata.id);
      }
      closeConnectModal();
    } catch (error: any) {
      console.error('onConnect error', error);
      if (error.code === 4001) {
        setRetryVisible(true);
      }
    }
  };

  const onBack = () => {
    setBackVisible(false);
    setSelectConnector(undefined);
  };

  const onClose = () => {
    closeConnectModal();
  };

  const onRetry = () => {
    setRetryVisible(false);
    if (selectConnector) {
      onConnect(selectConnector);
    }
  };

  return (
    <div className={styles.containerModal}>
      <div className={styles.modal}>
        <div className={styles.title}>{selectConnector?.metadata.name || 'Choose Wallet'}</div>
        <img className={styles.closeBtn} src={close} onClick={onClose}></img>
        {backVisible && <img className={styles.backBtn} src={back} onClick={onBack}></img>}

        {!backVisible &&
          connectors.map((connector) => {
            return (
              <div className={styles.walletItem} key={connector.metadata.id} onClick={() => onConnect(connector)}>
                <img className={styles.walletIcon} src={connector.metadata.icon}></img>
                <div className={styles.walletName}>{connector.metadata.name}</div>
              </div>
            );
          })}

        {backVisible && selectConnector && (
          <div className={styles.connecting}>
            <div className={styles.connectingIconContainer}>
              <img className={styles.connectingIcon} src={selectConnector.metadata.icon}></img>
              {retryVisible && (
                <div className={styles.retryContainer} onClick={onRetry}>
                  <img className={styles.retryIcon} src={retryIcon}></img>
                </div>
              )}
            </div>

            <div className={styles.connection}>{retryVisible ? 'Request Cancelled' : 'Requesting Connection'}</div>
            <div className={styles.acceptRequest}>
              {retryVisible
                ? 'You cancelled the request.\nClick above to try again.'
                : 'Accept the request through your wallet to connect to this app.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectModal;
