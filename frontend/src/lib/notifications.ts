
  x Expression expected
     ,-[/app/src/app/seller/inventory/page.tsx:129:1]
 129 |     </SellerLayout>
 130 |   );
 131 | }
 132 |         <div className="px-6 py-4 flex items-center justify-between">
     :                                                                     ^
 133 |           <div className="flex items-center gap-4">
 134 |             <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8" />
 135 |             <div className="h-6 w-px bg-gray-300/30" />
     `----

  x Expected ';', '}' or <eof>
     ,-[/app/src/app/seller/inventory/page.tsx:129:1]
 129 |         </SellerLayout>
 130 |       );
 131 |     }
 132 | ,->         <div className="px-6 py-4 flex items-center justify-between">
 133 | |             <div className="flex items-center gap-4">
 134 | |               <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8" />
 135 | |               <div className="h-6 w-px bg-gray-300/30" />
 136 | |               <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
 137 | |                 Seller CRM
 138 | |               </h1>
 139 | |             </div>
 140 | |
 141 | |->           <div className="flex items-center gap-3 md:gap-4">
     : `---               ^^^^^^^^^
     : `---- This is the expression part of an expression statement
 142 |                 <div className="relative hidden md:block">
 143 |                   <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
 144 |                   <input
     `----

Caused by:
    Syntax Error

Import trace for requested module:
./src/app/seller/inventory/page.tsx


> Build failed because of webpack errors
npm notice
npm notice New major version of npm available! 10.8.2 -> 11.8.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.8.0
npm notice To update run: npm install -g npm@11.8.0
npm notice
The command '/bin/sh -c npm run build' returned a non-zero code: 1
root@srv1196766:~/shop-by-soeurise#// Simple notification utility (can be enhanced with toast library later)
export const notifications = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // TODO: Add toast notification
  },
  error: (message: string) => {
    console.error('❌ Error:', message);
    // TODO: Add toast notification
  },
  info: (message: string) => {
    console.info('ℹ️ Info:', message);
    // TODO: Add toast notification
  },
};
