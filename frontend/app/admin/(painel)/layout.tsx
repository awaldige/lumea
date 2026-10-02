"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UsuarioAdmin = {
  id: number;
  nome: string;
  email: string;
  perfil: "CLIENTE" | "ADMIN";
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<UsuarioAdmin | null>(null);

  const [verificando, setVerificando] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("lumea_token");

    const usuarioSalvo =
      localStorage.getItem("lumea_usuario");

    if (!token || !usuarioSalvo) {
      router.replace("/admin/login");
      return;
    }

    try {
      const usuarioConvertido =
        JSON.parse(usuarioSalvo) as UsuarioAdmin;

      if (usuarioConvertido.perfil !== "ADMIN") {
        localStorage.removeItem("lumea_token");
        localStorage.removeItem("lumea_usuario");

        router.replace("/admin/login");
        return;
      }

      setUsuario(usuarioConvertido);
      setVerificando(false);
    } catch {
      localStorage.removeItem("lumea_token");
      localStorage.removeItem("lumea_usuario");

      router.replace("/admin/login");
    }
  }, [router]);

  function sair() {
    localStorage.removeItem("lumea_token");
    localStorage.removeItem("lumea_usuario");

    router.replace("/admin/login");
  }

  if (verificando || !usuario) {
    return (
      <main className="min-h-screen bg-[#f5f2ed]">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#756f69]">
            Carregando administração...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1f1d1a]">

      <header className="border-b border-[#e2d9ce] bg-[#1f1d1a] text-white">
        <div className="flex min-h-20 items-center justify-between px-6 lg:px-10">

          <div>
            <p className="font-cormorant text-3xl tracking-[0.14em]">
              LUMÉA
            </p>

            <p className="font-montserrat text-[8px] uppercase tracking-[0.3em] text-[#c9b59d]">
              Administração
            </p>
          </div>

          <div className="flex items-center gap-6">

            <div className="hidden text-right sm:block">
              <p className="font-montserrat text-[9px] uppercase tracking-[0.15em] text-[#c9b59d]">
                Administrador
              </p>

              <p className="mt-1 font-montserrat text-xs">
                {usuario.nome}
              </p>
            </div>

            <button
              type="button"
              onClick={sair}
              className="border border-white/20 px-4 py-2 font-montserrat text-[9px] uppercase tracking-[0.18em] transition hover:border-[#c9b59d] hover:text-[#c9b59d]"
            >
              Sair
            </button>

          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">

        <aside className="hidden w-64 shrink-0 border-r border-[#e2d9ce] bg-[#eee9e2] lg:block">

          <nav className="p-5">

            <p className="mb-5 px-3 font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
              Menu
            </p>

            <AdminLink
              href="/admin"
              label="Dashboard"
            />

            <AdminLink
              href="/admin/produtos"
              label="Produtos"
            />

            <AdminLink
              href="/admin/categorias"
              label="Categorias"
            />

            <AdminLink
              href="/admin/colecoes"
              label="Coleções"
            />

            <AdminLink
              href="/admin/pedidos"
              label="Pedidos"
            />

            <AdminLink
              href="/admin/cupons"
              label="Cupons"
            />

            <AdminLink
              href="/admin/clientes"
              label="Clientes"
            />

            <div className="my-6 h-px bg-[#ddd3c8]" />

            <AdminLink
              href="/"
              label="Voltar para a loja"
            />

          </nav>

        </aside>

        <main className="min-w-0 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}

function AdminLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="block border-l-2 border-transparent px-3 py-3 font-montserrat text-[10px] uppercase tracking-[0.14em] text-[#5f5042] transition hover:border-[#8c7355] hover:bg-white/60 hover:text-[#8c7355]"
    >
      {label}
    </a>
  );
}