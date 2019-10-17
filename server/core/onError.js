const chalk = require('chalk');
const config = require('../../config/config');

const PORT = config.PORT;

const onError = (err, req, res, next) => {
  // if (err.syscall !== "listen") throw err;

  const bind = typeof port === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
  console.error(chalk.blue('Here a onError Switch'));

  switch (true) {
    case err.code === 'EACCES':
      console.error(
        `${chalk.yellow(bind)} ${chalk.red('requires elevated privileges')}`
      );
      process.exit(1);
      break;
    case err.code === 'EADDRINUSE':
      console.error(`${chalk.yellow(bind)} ${chalk.red('is already in use')}`);
      process.exit(1);
      break;
    default:
      console.error(chalk.blue('Here a onError Switch'));
      console.error(chalk.yellow('You may handle this error'));
      throw err;
  }
};

module.exports = onError;
