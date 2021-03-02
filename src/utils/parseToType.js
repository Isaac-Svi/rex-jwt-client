const parseToType = (res, type) => {
  switch (type.toLowerCase()) {
    case 'text':
      return res.text()
    case 'json':
      return res.json()
    default:
      throw new Error('Invalid responseType')
  }
}

export default parseToType
