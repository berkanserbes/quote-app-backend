class ResponseModel {
  constructor(data = null, message = "", isSuccess = false) {
    this.data = data;
    this.message = message;
    this.isSuccess = isSuccess;
  }
}

module.exports = ResponseModel;
