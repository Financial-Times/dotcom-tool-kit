class BuildCI {
   async check() {
      return false
   }

   async install() {
      console.log('installing build:ci')
   }
}

class BuildLocal {
   async check() {
      return false
   }

   async install() {
      console.log('installing build:local')
   }
}

class BuildDeploy {
   async check() {
      return false
   }

   async install() {
      console.log('installing build:deploy')
   }
}

export const lifecycles = {
   'build:local': BuildLocal,
   'build:ci': BuildCI,
   'build:deploy': BuildDeploy
}
