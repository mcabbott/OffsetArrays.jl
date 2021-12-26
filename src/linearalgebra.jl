using LinearAlgebra
using LinearAlgebra: MulAddMul, mul!
lapack_axes(t::AbstractChar, M::AbstractVecOrMat) = (axes(M, t=='N' ? 1 : 2), axes(M, t=='N' ? 2 : 1))

# The signature of this differs from LinearAlgebra's only on C
function LinearAlgebra.generic_matvecmul!(C::OffsetVector, tA, A::AbstractVecOrMat, B::AbstractVector,
                            _add::MulAddMul = MulAddMul())

    mB_axis = Base.axes1(B)
    mA_axis, nA_axis = lapack_axes(tA, A)

    if mB_axis != nA_axis
        throw(DimensionMismatch("mul! can't contract axis $(UnitRange(nA_axis)) from A with axes(B) == ($(UnitRange(mB_axis)),)"))
    end
    if mA_axis != Base.axes1(C)
        throw(DimensionMismatch("mul! got axes(C) == ($(UnitRange(Base.axes1(C))),), expected $(UnitRange(mA_axis))"))
    end

    C1 = no_offset_view(C)
    A1 = no_offset_view(A)
    B1 = no_offset_view(B)

    if tA == 'T'
        mul!(C1, transpose(A1),  B1, _add.alpha, _add.beta)
    elseif tA == 'C'
        mul!(C1, adjoint(A1), B1, _add.alpha, _add.beta)
    elseif tA == 'N'
        mul!(C1, A1, B1, _add.alpha, _add.beta)
    else
        error("illegal char")
    end

    C
end

LinearAlgebra.generic_matmatmul!(C::OffsetMatrix, tA, tB, A::AbstractMatrix, B::AbstractMatrix,
                             _add::MulAddMul) = unwrap_matmatmul!(C, tA, tB, A, B, _add)
LinearAlgebra.generic_matmatmul!(C::Union{OffsetMatrix, OffsetVector}, tA, tB, A::AbstractVecOrMat, B::AbstractVecOrMat,
                             _add::MulAddMul) = unwrap_matmatmul!(C, tA, tB, A, B, _add)

function unwrap_matmatmul!(C::Union{OffsetMatrix, OffsetVector}, tA, tB, A::AbstractVecOrMat, B::AbstractVecOrMat,
                             _add::MulAddMul)

    mA_axis, nA_axis = lapack_axes(tA, A)
    mB_axis, nB_axis = lapack_axes(tB, B)

    if nA_axis != mB_axis
        throw(DimensionMismatch("mul! can't contract axis $(UnitRange(nA_axis)) from A with $(UnitRange(mB_axis)) from B"))
    elseif mA_axis != axes(C,1)
        throw(DimensionMismatch("mul! got axes(C,1) == $(UnitRange(axes(C,1))), expected $(UnitRange(mA_axis)) from A"))
    elseif nB_axis != axes(C,2)
        throw(DimensionMismatch("mul! got axes(C,2) == $(UnitRange(axes(C,2))), expected $(UnitRange(nB_axis)) from B"))
    end

    C1 = no_offset_view(C)
    A1 = no_offset_view(A)
    B1 = no_offset_view(B)

   if tA == 'N'
        if tB == 'N'
            mul!(C1, A1, B1, _add.alpha, _add.beta)
        elseif tB == 'T'
            mul!(C1, A1, transpose(B1), _add.alpha, _add.beta)
        elseif tB == 'C'
            mul!(C1, A1, adjoint(B1), _add.alpha, _add.beta)
        else
            error("illegal char")
        end
    elseif tA == 'T'
        if tB == 'N'
            mul!(C1, transpose(A1), B1, _add.alpha, _add.beta)
        elseif tB == 'T'
            mul!(C1, transpose(A1), transpose(B1), _add.alpha, _add.beta)
        elseif tB == 'C'
            mul!(C1, transpose(A1), adjoint(B1), _add.alpha, _add.beta)
        else
            error("illegal char")
        end
    elseif tA == 'C'
        if tB == 'N'
            mul!(C1, adjoint(A1), B1, _add.alpha, _add.beta)
        elseif tB == 'T'
            mul!(C1, adjoint(A1), transpose(B1), _add.alpha, _add.beta)
        elseif tB == 'C'
            mul!(C1, adjoint(A1), adjoint(B1), _add.alpha, _add.beta)
        else
            error("illegal char")
        end
    else
        error("illegal char")
    end

    C
end
