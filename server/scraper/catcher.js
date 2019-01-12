export default (target, methodName, methodValue) => {
  target[methodName] = (async (...args) => {
    try {
      await methodValue(...args)
    } catch (error) {
      console.error(`\n\nERROR in ${methodName}:`, error)
    }
  }).bind(target)
}
