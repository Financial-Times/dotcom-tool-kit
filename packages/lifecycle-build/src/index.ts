class BuildCI {
   async verify() {
      return false
   }

   async install() {
      console.log('installing build:ci')
   }
}


export const lifecycles = {
   'build:ci': BuildCI
}
