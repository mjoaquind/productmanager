class LoggersController {
    static testLoggers = async (req, res) => {
        req.logger.fatal("Logger test Fatal");
        req.logger.error("Logger test Error");
        req.logger.warning("Logger test Warning");
        req.logger.info("Logger test Info");
        req.logger.http("Logger test Http");
        req.logger.debug("Logger test Debug");
        res.send("Logger test");
    }
}

export { LoggersController }